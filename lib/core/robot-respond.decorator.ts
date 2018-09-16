import { appendRobotListenerBinding } from './utils/decorators';

export const HUBULAR_TYPE_ROBOT_RESPOND = 'hubular:robotRespond';

export function RobotRespond(expression: RegExp) {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {

        appendRobotListenerBinding(target, HUBULAR_TYPE_ROBOT_RESPOND,
            (instance, robot) => {
                robot.respond(expression, (...args) => {
                    descriptor.value.apply(instance, args);
                });
            });

        return target;
    };
}
