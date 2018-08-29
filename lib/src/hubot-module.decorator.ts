import { Type } from 'injection-js';
import { HubotModuleConfiguration } from './model';

export function HubotModule(config?: HubotModuleConfiguration) {
    return (target: Type<any>) => {

        config = config || { providers: [] };

        Reflect.set(target, 'hubotModuleConfig', config);

        return target;
    };
}
