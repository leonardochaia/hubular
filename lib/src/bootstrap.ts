import { HubotModuleDefinition, HubotModuleTypeConfig } from './model';
import { ReflectiveInjector, Type } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT } from './injection-tokens';

export function bootstrapModule(rootModule: Type<HubotModuleDefinition>) {
    return (robot: Robot) => {

        const injector = getInjectorForRobot(robot, rootModule);

        const doBootstrap = (def: Type<HubotModuleDefinition>) => {

            const moduleConfig = getModuleTypeConfig(def);
            if (moduleConfig.imports && moduleConfig.imports.length) {
                for (const childModule of moduleConfig.imports) {
                    doBootstrap(childModule);
                }
            }

            const mod = injector.get(def) as HubotModuleDefinition;
            if (mod.run && typeof mod.run === 'function') {
                robot.logger.info(`Bootstrapping: ${def.name}`);
                mod.run(robot);
            }
        };

        doBootstrap(rootModule);

    };
}

function getInjectorForRobot(robot: Robot, rootModule: Type<HubotModuleDefinition>) {

    const robotWithInjector = robot as Robot & { injector: ReflectiveInjector };

    if (!robotWithInjector.injector) {
        const modules = traverseModules(rootModule);
        const providers = modules

            // Flattern providers
            .map(m => m.hubotModuleConfig.providers)
            .reduce((a, b) => [...a, ...b], [])

            // Add modules to the injector too
            .concat(modules)
            .filter(m => !!m);

        providers.push(
            {
                provide: ROBOT,
                useValue: robot
            },
            {
                provide: BRAIN,
                useValue: robot.brain
            }
        );

        robot.logger.info(`Creating Injector for: [${modules.map(m => m.name)}]`);

        robotWithInjector.injector = ReflectiveInjector.resolveAndCreate(providers);
    }

    return robotWithInjector.injector;
}

function traverseModules(root: Type<HubotModuleDefinition>) {

    const output: HubotModuleTypeConfig[] = [];

    const traverse = (module: Type<HubotModuleDefinition>) => {
        const config = getModuleTypeConfig(module);
        if (config.imports) {
            for (const childModule of config.imports) {
                traverse(childModule);
            }
        }

        output.push(module as HubotModuleTypeConfig);
    };

    traverse(root);

    return output;
}

function getModuleTypeConfig(mod: Type<HubotModuleDefinition>) {
    const configType = mod as HubotModuleTypeConfig;

    if (!configType) {
        throw new Error(`Invalid module [${mod.name}]. Did you add the @HubotModule decorator?`);
    }

    return configType.hubotModuleConfig;
}
