// tslint:disable:max-classes-per-file
import 'reflect-metadata';

import { bootstrapModule, HubularModule, ROBOT, BRAIN, HubularRobot } from '../lib';
import { Injector, Injectable, InjectionToken, Inject, Type } from 'injection-js';

function createRobot() {
    return {
        brain: new Map<string, any>(),
        injector: Injector.NULL,
        logger: console,
    } as any as HubularRobot;
}

function bootstrapModuleWithMockRobot(rootModule: Type<any>) {
    const robot = createRobot();
    const fn = bootstrapModule(rootModule);

    fn(robot);

    return robot;
}

export default describe('Bootstrapping', () => {
    it('should create robot.injector', () => {

        @HubularModule()
        class AppModule { }

        const robot = bootstrapModuleWithMockRobot(AppModule);

        expect(() => robot.injector).toBeDefined();
    });

    it('should register robot and brain in injector', () => {

        @HubularModule()
        class AppModule { }

        const robot = bootstrapModuleWithMockRobot(AppModule);

        expect(robot.injector.get(ROBOT)).toBe(robot);
        expect(robot.injector.get(BRAIN)).toBe(robot.brain);
    });

    it('should register custom providers in injector', () => {

        @Injectable()
        class FooService {
            public readonly bar = 'foobar';
        }

        const valueToken = new InjectionToken('VALUE_TOKEN');

        @HubularModule({
            providers: [
                FooService,
                {
                    provide: valueToken,
                    useValue: 128
                }
            ]
        })
        class AppModule { }

        const robot = bootstrapModuleWithMockRobot(AppModule);

        expect(robot.injector.get(FooService)).toBeDefined();
        expect(robot.injector.get(FooService).bar).toBe('foobar');

        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should register root module imports', () => {

        const valueToken = new InjectionToken('VALUE_TOKEN');

        @HubularModule({
            providers: [
                {
                    provide: valueToken,
                    useValue: 128
                }
            ]
        })
        class ChildModule { }

        @HubularModule({
            imports: [
                ChildModule
            ]
        })
        class AppModule { }

        const robot = bootstrapModuleWithMockRobot(AppModule);

        expect(robot.injector.get(ChildModule)).toBeDefined();
        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should instantiate modules using the injector', () => {

        @HubularModule()
        class ChildModule {

            constructor(
                @Inject(ROBOT)
                rb: HubularRobot
            ) {
                rb.brain.set('child', true);
            }
        }

        @HubularModule({
            imports: [
                ChildModule
            ]
        })
        class AppModule {

            constructor(
                @Inject(ROBOT)
                rb: HubularRobot
            ) {
                rb.brain.set('root', true);
            }
        }

        const robot = bootstrapModuleWithMockRobot(AppModule);

        expect(robot.brain.get('root')).toBeTruthy();
        expect(robot.brain.get('child')).toBeTruthy();
    });

    it('should throw when invalid module', () => {

        // Without @HubularModule()
        class AppModule { }

        expect(() => bootstrapModuleWithMockRobot(AppModule))
            .toThrowError(`Invalid module [AppModule]. Did you add the @HubularModule decorator?`);
    });
});
