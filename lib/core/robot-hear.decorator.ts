import { appendRobotListenerBinding } from './utils/decorators';

export const HUBULAR_TYPE_ROBOT_HEAR = 'hubular:robotHear';

export function RobotHear(expression: RegExp) {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {

        appendRobotListenerBinding(target, HUBULAR_TYPE_ROBOT_HEAR,
            (instance, robot) => {
                robot.hear(expression, (...args) => {
                    descriptor.value.apply(instance, args);
                });
            });

        return target;
    };
}
