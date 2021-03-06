import { applyRobotListenerBindings } from './utils/decorators';
import { HUBULAR_TYPE_ROBOT_HEAR } from './robot-hear.decorator';
import { HUBULAR_TYPE_ROBOT_RESPOND } from './robot-respond.decorator';
import { Provider, Type } from 'injection-js';
import { MODULE_INITIALIZER } from './injection-tokens';
import { HubularRobot } from '../core/hubular-robot.model';
import { HUBULAR_TYPE_ROBOT_CATCH_ALL } from './robot-catch-all.decorator';

export const robotBindingsInitializerProvider: Provider = {
    deps: [HubularRobot],
    multi: true,
    provide: MODULE_INITIALIZER,
    useFactory: robotBindingsInitializer,
};

function robotBindingsInitializer(robot: HubularRobot) {
    return (moduleDefinition: Type<any>, instance: any) => {
        applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_HEAR, instance);
        applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_RESPOND, instance);
        applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_CATCH_ALL, instance);
    };
}
