import { appendRobotListenerBinding } from './utils/decorators';

export const HUBULAR_TYPE_ROBOT_CATCH_ALL = 'hubular:robotCatchAll';

export function RobotCatchAll() {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {

        appendRobotListenerBinding(target, HUBULAR_TYPE_ROBOT_CATCH_ALL,
            (instance, robot) => {
                robot.catchAll((...args) => {
                    descriptor.value.apply(instance, args);
                });
            });

        return target;
    };
}
