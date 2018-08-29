import { Type } from 'injection-js';
import { HubotModuleConfiguration } from './model';

export const HUBULAR_MODULE_TYPE_CONFIG = 'hubularModuleConfig';

export function HubularModule(config?: HubotModuleConfiguration) {
    return (target: Type<any>) => {

        config = config || { providers: [] };

        Reflect.set(target, HUBULAR_MODULE_TYPE_CONFIG, config);

        return target;
    };
}
