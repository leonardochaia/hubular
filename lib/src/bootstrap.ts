import { HubotModuleDefinition, HubotModuleTypeConfig, HubotFrameworkRobot } from './model';
import { ReflectiveInjector, Type, Provider } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT } from './injection-tokens';

export function bootstrapModule(rootModule: Type<HubotModuleDefinition>) {
    return (rb: Robot) => {

        const robot = rb as HubotFrameworkRobot;
        const injector = createInjectorForRobot(robot, rootModule);
        robot.injector = injector;

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

function createInjectorForRobot(robot: Robot, rootModule: Type<HubotModuleDefinition>) {

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

function createInjectorForModule(rootModule: Type<HubotModuleDefinition>,
    providers: Provider[]) {

    // Get all providers from modules.
    const modules = traverseModules(rootModule);
    const moduleProviders = modules
        // Flattern providers.
        .map(m => m.hubotModuleConfig.providers)
        .reduce((a, b) => [...a, ...b], [])

        // Add modules to the injector too.
        .concat(modules);

    providers = (providers || [])
        .concat(moduleProviders)
        .filter(m => !!m);

    return ReflectiveInjector.resolveAndCreate(providers);
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
