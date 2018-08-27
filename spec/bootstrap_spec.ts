// tslint:disable:max-classes-per-file
import 'reflect-metadata';

import { bootstrapModule, HubotModule, HubotModuleDefinition, ROBOT, BRAIN } from '../lib';
import { Injector, Injectable, InjectionToken } from 'injection-js';
import { HubotFrameworkRobot } from '../lib/src/model';

function createRobot() {
    return {
        brain: new Map<string, any>(),
        injector: null as Injector,
        logger: console,
    } as any as HubotFrameworkRobot;
}

describe('Bootstrapping', () => {
    it('should create robot.injector', () => {

        const robot = createRobot();

        @HubotModule()
        class RootModule implements HubotModuleDefinition { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(() => robot.injector).toBeDefined();
    });

    it('should register robot and brain in injector', () => {

        const robot = createRobot();

        @HubotModule()
        class RootModule implements HubotModuleDefinition { }

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
        class RootModule implements HubotModuleDefinition { }

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
        class RootModule implements HubotModuleDefinition { }

        const fn = bootstrapModule(RootModule);

        fn(robot);

        expect(robot.injector.get(ChildModule)).toBeDefined();
        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should execute modules run', () => {

        const robot = createRobot();

        @HubotModule()
        class ChildModule implements HubotModuleDefinition {

            public run(rb: HubotFrameworkRobot) {
                rb.brain.set('child', true);
            }
        }

        @HubotModule({
            imports: [
                ChildModule
            ]
        })
        class RootModule implements HubotModuleDefinition {

            public run(rb) {
                rb.brain.set('root', true);
            }
        }

        const fn = bootstrapModule(RootModule);

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
