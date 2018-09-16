import { ReflectiveInjector, Type, Provider } from 'injection-js';
import { Robot } from 'hubot';
import { BRAIN, ROBOT, MODULE_INITIALIZER, AFTER_BOOTSTRAP, BEFORE_BOOTSTRAP } from '../core/injection-tokens';
import { HubularRobot } from '../core/hubular-robot.model';
import { HubotModuleConfiguration } from './model';
import { HUBULAR_MODULE_TYPE_CONFIG } from './hubular-module.decorator';
import { Logger } from '../core/logger';
import { HubularCoreModule } from '../core/core.module';

export function bootstrapModule(rootModule: Type<any>) {
    return <TAdapter>(rb: Robot<TAdapter>) => {

        const robot = rb as HubularRobot<TAdapter>;

        const { injector, modules } = createInjectorForRobot(robot, rootModule);
        robot.injector = injector;

        const initializers = injector.get(MODULE_INITIALIZER, []) as ((module?: Type<any>, instance?: any) => void)[];

        const beforeBootstrap = injector.get(BEFORE_BOOTSTRAP, []) as (() => void)[];
        beforeBootstrap.forEach(ab => ab());

        const logger = injector.get(Logger) as Logger;

        // Bootstrap
        for (const moduleDefinition of modules) {
            try {
                logger.debug(`Instantiating ${moduleDefinition.name}`);
                const instance = injector.get(moduleDefinition);
                initializers.forEach(initializer => initializer(moduleDefinition, instance));
            } catch (error) {
                logger.error(`Failed instantiation of module ${moduleDefinition.name}`);
                throw error;
            }
        }

        const afterBootstrap = injector.get(AFTER_BOOTSTRAP, []) as (() => void)[];
        afterBootstrap.forEach(ab => ab());
    };
}

function createInjectorForRobot<TAdapter>(
    robot: HubularRobot<TAdapter>,
    rootModule: Type<any>) {

    const providers: Provider[] = [
        {
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
    modules.unshift(HubularCoreModule);
    const moduleProviders = [];

    for (const mod of modules) {
        const modProviders = getModuleTypeConfig(mod).providers || [];
        modProviders.push(mod);

        moduleProviders.push(modProviders);
    }

    providers = (providers || [])
        .concat(moduleProviders)
        .filter(m => !!m);

    return {
        injector: ReflectiveInjector.resolveAndCreate(providers),
        modules
    };
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
