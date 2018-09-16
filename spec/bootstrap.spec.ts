// tslint:disable:max-classes-per-file
import {
    bootstrapModule, HubularModule,
    HubularRobot, Injectable, InjectionToken,
    MODULE_INITIALIZER, AFTER_BOOTSTRAP, Injector
} from '../lib';
import { RobotMock } from './robot-mock';

let robotMock: RobotMock;
let robot: HubularRobot & { injector: Injector };

beforeEach(() => {
    robotMock = new RobotMock();
    robot = robotMock.robot;
});

afterEach(() => {
    robotMock.dispose();
});

export default describe('Bootstrapping', () => {
    it('should create robot.injector', () => {

        @HubularModule()
        class AppModule { }

        bootstrapModule(AppModule)(robot);

        expect(() => robot.injector).toBeDefined();
    });

    it('should register HubularRobot in injector', () => {

        @HubularModule()
        class AppModule { }

        bootstrapModule(AppModule)(robot);

        expect(robot.injector.get(HubularRobot)).toBe(robot);
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

        bootstrapModule(AppModule)(robot);

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

        bootstrapModule(AppModule)(robot);

        expect(robot.injector.get(ChildModule)).toBeDefined();
        expect(robot.injector.get(valueToken)).toBe(128);
    });

    it('should instantiate modules using the injector', () => {

        @HubularModule()
        class ChildModule {

            constructor(
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
                rb: HubularRobot
            ) {
                rb.brain.set('root', true);
            }
        }

        bootstrapModule(AppModule)(robot);

        expect(robot.brain.get('root')).toBeTruthy();
        expect(robot.brain.get('child')).toBeTruthy();
    });

    it('should throw when invalid module', () => {

        // Without @HubularModule()
        class AppModule { }

        expect(() => bootstrapModule(AppModule)(robot))
            .toThrowError(`Invalid module [AppModule]. Did you add the @HubularModule decorator?`);
    });

    it('should execute MODULE_INITIALIZER when bootstrapping', () => {

        const spy = jasmine.createSpy('initializer');
        function initializeModule() {
            return spy;
        }

        @HubularModule({
            providers: [
                {
                    deps: [],
                    multi: true,
                    provide: MODULE_INITIALIZER,
                    useFactory: initializeModule,
                }
            ]
        })
        class AppModule { }

        bootstrapModule(AppModule)(robot);

        expect(spy).toHaveBeenCalled();
    });

    it('should execute AFTER_BOOTSTRAP', () => {

        const spy = jasmine.createSpy('initializer');
        function afterBootstrap() {
            return spy;
        }

        @HubularModule({
            providers: [
                {
                    deps: [],
                    multi: true,
                    provide: AFTER_BOOTSTRAP,
                    useFactory: afterBootstrap,
                }
            ]
        })
        class AppModule { }

        bootstrapModule(AppModule)(robot);

        expect(spy).toHaveBeenCalled();
    });
});
