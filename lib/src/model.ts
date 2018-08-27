import { Provider, Type, Injector } from 'injection-js';
import { Robot } from 'hubot';

export interface HubotModuleConfiguration {
    providers?: Provider[];
    imports?: Type<HubotModuleDefinition>[];
}

export interface HubotModuleDefinition {
    run?(robot: HubotFrameworkRobot): void;
}

export interface HubotModuleTypeConfig extends Type<HubotModuleDefinition> {
    hubotModuleConfig: HubotModuleConfiguration;
    name: string;
}

export interface HubotFrameworkRobot<TAdapter = any> extends Robot<TAdapter> {
    injector: Injector;
}
