import { Provider, Type } from 'injection-js';

export interface HubotModuleConfiguration {
    providers?: Provider[];
    imports?: Type<any>[];
}

export interface HubotModuleTypeConfig extends Type<any> {
    hubotModuleConfig: HubotModuleConfiguration;
    name: string;
}
