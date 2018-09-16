import { applyRobotListenerBindings } from './utils/decorators';
import { HUBULAR_TYPE_ROBOT_HEAR } from './robot-hear.decorator';
import { HUBULAR_TYPE_ROBOT_RESPOND } from './robot-respond.decorator';
import { Provider, Type } from 'injection-js';
import { ROBOT, MODULE_INITIALIZER } from './injection-tokens';
import { HubularRobot } from './hubular-robot.model';

export const robotBindingsInitializerProvider: Provider = {
    deps: [ROBOT],
    multi: true,
    provide: MODULE_INITIALIZER,
    useFactory: robotBindingsInitializer,
};

function robotBindingsInitializer(robot: HubularRobot) {
    return (moduleDefinition: Type<any>, instance: any) => {
        robot.logger.debug(`Executing @Robot* bindings ${moduleDefinition.name}`);
        applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_HEAR, instance);
        applyRobotListenerBindings(robot, HUBULAR_TYPE_ROBOT_RESPOND, instance);
    };
}
