import { Type } from 'injection-js';
import {
    HubotModuleConfiguration,
    HubotModuleDefinition,
    HubotModuleTypeConfig
} from './model';

export function HubotModule(config?: HubotModuleConfiguration) {
    return (target: Type<HubotModuleDefinition>) => {

        const typeConfig = target as HubotModuleTypeConfig;
        typeConfig.hubotModuleConfig = config || { providers: [] };
    };
}
