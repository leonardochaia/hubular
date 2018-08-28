// tslint:disable:max-classes-per-file
import 'reflect-metadata';

import { bootstrapModule, HubotModule, ROBOT, BRAIN, HubularRobot } from '../lib';
import { Injector, Injectable, InjectionToken, Inject } from 'injection-js';

function createRobot() {
    return {
        brain: new Map<string, any>(),
        injector: Injector.NULL,
        logger: console,
    } as any as HubularRobot;
}

export default describe('Bootstrapping', () => {
    it('should create robot.injector', () => {

        const robot = createRobot();

        @HubotModule()
        class RootModule { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(() => robot.injector).toBeDefined();
    });

    it('should register robot and brain in injector', () => {

        const robot = createRobot();

        @HubotModule()
        class RootModule { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(robot.injector.get(ROBOT)).toBe(robot);
        expect(robot.injector.get(BRAIN)).toBe(robot.brain);
    });

    it('should register custom providers in injector', () => {

        const robot = createRobot();

        @Injectable()
        class FooService {
            public readonly bar = 'foobar';
        }

        const valueToken = new InjectionToken('VALUE_TOKEN');

        @HubotModule({
            providers: [
                FooService,
                {
                    provide: valueToken,
                    useValue: 128
                }
            ]
        })
        class RootModule { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(robot.injector.get(FooService)).toBeDefined();
        expect(robot.injector.get(FooService).bar).toBe('foobar');

        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should register root module imports', () => {

        const robot = createRobot();

        const valueToken = new InjectionToken('VALUE_TOKEN');

        @HubotModule({
            providers: [
                {
                    provide: valueToken,
                    useValue: 128
                }
            ]
        })
        class ChildModule { }

        @HubotModule({
            imports: [
                ChildModule
            ]
        })
        class RootModule { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(robot.injector.get(ChildModule)).toBeDefined();
        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should instantiate modules using the injector', () => {

        @HubotModule()
        class ChildModule {

            constructor(
                @Inject(ROBOT)
                rb: HubularRobot
            ) {
                rb.brain.set('child', true);
            }
        }

        @HubotModule({
            imports: [
                ChildModule
            ]
        })
        class RootModule {

            constructor(
                @Inject(ROBOT)
                rb: HubularRobot
            ) {
                rb.brain.set('root', true);
            }
        }

        const fn = bootstrapModule(RootModule);

        const robot = createRobot();
        fn(robot);

        expect(robot.brain.get('root')).toBeTruthy();
        expect(robot.brain.get('child')).toBeTruthy();
    });

    it('should throw when invalid module', () => {

        const robot = createRobot();

        // Without @HubotModule()
        class RootModule { }

        const fn = bootstrapModule(RootModule);

        expect(() => fn(robot)).toThrowError(`Invalid module [RootModule]. Did you add the @HubotModule decorator?`);
    });
});
