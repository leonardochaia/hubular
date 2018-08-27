import { HubotFrameworkRobot } from './model';

export function reloadInjector(robot: HubotFrameworkRobot) {
    delete robot.injector;
}
