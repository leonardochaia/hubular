import { ReflectiveInjector, Type, Provider } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT, MODULE_INITIALIZER, AFTER_BOOTSTRAP } from './injection-tokens';
import { HubularRobot } from './hubular-robot.model';
import { HubotModuleConfiguration } from './model';
import { HUBULAR_MODULE_TYPE_CONFIG } from './hubular-module.decorator';
import { HUBULAR_TYPE_ROBOT_HEAR } from './robot-hear.decorator';
import { applyRobotListenerBindings } from './utils/decorators';
import { HUBULAR_TYPE_ROBOT_RESPOND } from './robot-respond.decorator';

export function bootstrapModule(rootModule: Type<any>) {
    return <TAdapter>(rb: Robot<TAdapter>) => {

        const robot = rb as HubularRobot<TAdapter>;
        const injector = createInjectorForRobot(robot, rootModule);
        robot.injector = injector;

        const initializers = injector.get(MODULE_INITIALIZER, []) as ((module?: Type<any>, instance?: any) => void)[];

        const doBootstrap = (moduleDefinition: Type<any>) => {

            const moduleConfig = getModuleTypeConfig(moduleDefinition);
            if (moduleConfig.imports && moduleConfig.imports.length) {
                for (const childModule of moduleConfig.imports) {
                    doBootstrap(childModule);
                }
            }

            try {
                robot.logger.debug(`Instantiating ${moduleDefinition.name}`);
                const instance = injector.get(moduleDefinition);

                robot.logger.debug(`Executing Initializers for: ${moduleDefinition.name}`);
                initializers.forEach(initializer => initializer(moduleDefinition, instance));

                // TODO: Move to module initializer
                robot.logger.debug(`Executing @Robot* bindings ${moduleDefinition.name}`);
                applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_HEAR, instance);
                applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_RESPOND, instance);
            } catch (error) {
                robot.logger.error(`Failed instantiation of module ${moduleDefinition.name}`);
                throw error;
            }
        };

        doBootstrap(rootModule);

        const afterBootstrap = injector.get(AFTER_BOOTSTRAP, []) as (() => void)[];
        afterBootstrap.forEach(ab => ab());
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
