import { Robot } from 'hubot';
import { Injector } from 'injection-js';

export function reloadInjector(robot: Robot) {
    const robotWithInjector = robot as Robot & { injector: Injector };
    delete robotWithInjector.injector;
}
