import { HubotModuleTypeConfig, HubotFrameworkRobot } from './model';
import { ReflectiveInjector, Type, Provider } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT } from './injection-tokens';

export function bootstrapModule(rootModule: Type<any>) {
    return <TAdapter>(rb: Robot<TAdapter>) => {

        const robot = rb as HubotFrameworkRobot<TAdapter>;
        const injector = createInjectorForRobot(robot, rootModule);
        robot.injector = injector;

        const doBootstrap = (moduleDefinition: Type<any>) => {

            const moduleConfig = getModuleTypeConfig(moduleDefinition);
            if (moduleConfig.imports && moduleConfig.imports.length) {
                for (const childModule of moduleConfig.imports) {
                    doBootstrap(childModule);
                }
            }

            try {
                robot.logger.info(`Instantiating ${moduleDefinition.name}`);
                injector.get(moduleDefinition);
            } catch (error) {
                robot.logger.error(`Failed instantiation of module ${moduleDefinition.name}`);
                robot.logger.error(error);
                throw error;
            }
        };

        doBootstrap(rootModule);
    };
}

function createInjectorForRobot<TAdapter>(
    robot: HubotFrameworkRobot<TAdapter>,
    rootModule: Type<any>) {

    const providers = [{
        provide: ROBOT,
        useValue: robot
    },
    {
        provide: BRAIN,
        useValue: robot.brain
    }
    ];

    return createInjectorForModule(rootModule, providers);
}

function createInjectorForModule(
    rootModule: Type<any>,
    providers: Provider[]) {

    // Get all providers from modules.
    const modules = traverseModules(rootModule);
    const moduleProviders = modules
        // Flattern providers.
        .map(m => m.hubotModuleConfig.providers || [])
        .reduce((a, b) => [...a, ...b], [])

        // Add modules to the injector too.
        .concat(modules);

    providers = (providers || [])
        .concat(moduleProviders)
        .filter(m => !!m);

    return ReflectiveInjector.resolveAndCreate(providers);
}

function traverseModules(root: Type<any>) {

    const output: HubotModuleTypeConfig[] = [];

    const traverse = (module: Type<any>) => {
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

function getModuleTypeConfig(mod: Type<any>) {
    const configType = mod as HubotModuleTypeConfig;

    if (!configType.hubotModuleConfig) {
        throw new Error(`Invalid module [${mod.name}]. Did you add the @HubotModule decorator?`);
    }

    return configType.hubotModuleConfig;
}
