import { Type } from 'injection-js';
import { HubotModuleConfiguration, HubotModuleTypeConfig } from './model';

export function HubotModule(config?: HubotModuleConfiguration) {
    return (target: Type<any>) => {

        const typeConfig = target as HubotModuleTypeConfig;
        typeConfig.hubotModuleConfig = config || { providers: [] };
    };
}
