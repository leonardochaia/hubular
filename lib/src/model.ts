import { Provider, Type } from 'injection-js';
import { Robot } from 'hubot';

export interface HubotModuleConfiguration {
    providers?: Provider[];
    imports?: Type<HubotModuleDefinition>[];
}

export interface HubotModuleDefinition {
    run?(robot: Robot): void;
}

export interface HubotModuleTypeConfig extends Type<HubotModuleDefinition> {
    hubotModuleConfig: HubotModuleConfiguration;
    name: string;
}
