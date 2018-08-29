import { HubularRobot } from '../hubular-robot.model';
import { Type } from 'injection-js';

type RobotListenerBinding = (instance: any, robot: HubularRobot) => void;

export function appendRobotListenerBinding(target: Type<any>, key: string, binding: RobotListenerBinding) {
    let descriptors: RobotListenerBinding[] = [];

    if (Reflect.has(target, key)) {
        descriptors = Reflect.get(target, key) as RobotListenerBinding[];
    }

    descriptors.push(binding);

    Reflect.set(target, key, descriptors);
}

export function applyRobotListenerBindings(robot: HubularRobot, bindingKey: string, instance: any) {
    if (Reflect.has(instance, bindingKey)) {
        const descriptors = Reflect.get(instance, bindingKey) as RobotListenerBinding[];
        for (const descriptor of descriptors) {
            descriptor(instance, robot);
        }
    }
}
