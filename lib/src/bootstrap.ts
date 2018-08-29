import { ReflectiveInjector, Type, Provider } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT } from './injection-tokens';
import { HubularRobot } from './hubular-robot.model';
import { HubotModuleConfiguration } from './model';
import { HUBULAR_MODULE_TYPE_CONFIG } from './hubular-module.decorator';

export function bootstrapModule(rootModule: Type<any>) {
    return <TAdapter>(rb: Robot<TAdapter>) => {

        const robot = rb as HubularRobot<TAdapter>;
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
                robot.logger.debug(`Instantiating ${moduleDefinition.name}`);
                injector.get(moduleDefinition);
            } catch (error) {
                robot.logger.error(`Failed instantiation of module ${moduleDefinition.name}`);
                throw error;
            }
        };

        doBootstrap(rootModule);
    };
}

function createInjectorForRobot<TAdapter>(
    robot: HubularRobot<TAdapter>,
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
    const moduleProviders = [];

    for (const mod of modules) {
        const modProviders = getModuleTypeConfig(mod).providers || [];
        modProviders.push(mod);

        moduleProviders.push(modProviders);
    }

    providers = (providers || [])
        .concat(moduleProviders)
        .filter(m => !!m);

    return ReflectiveInjector.resolveAndCreate(providers);
}

function traverseModules(root: Type<any>) {

    const output: Type<any>[] = [];

    const traverse = (module: Type<any>) => {
        const config = getModuleTypeConfig(module);
        if (config.imports) {
            for (const childModule of config.imports) {
                traverse(childModule);
            }
        }

        output.push(module);
    };

    traverse(root);

    return output;
}

function getModuleTypeConfig(mod: Type<any>) {

    const config = Reflect.get(mod, HUBULAR_MODULE_TYPE_CONFIG);

    if (!config) {
        throw new Error(`Invalid module [${mod.name}]. Did you add the @HubularModule decorator?`);
    }

    return config as HubotModuleConfiguration;
}
