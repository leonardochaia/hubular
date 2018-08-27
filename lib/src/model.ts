import { Provider, Type, Injector } from 'injection-js';
import { Robot, Brain } from 'hubot';

export interface HubotModuleConfiguration {
    providers?: Provider[];
    imports?: Type<any>[];
}

export interface HubotModuleTypeConfig extends Type<any> {
    hubotModuleConfig: HubotModuleConfiguration;
    name: string;
}

export interface HubotFrameworkRobot<TAdapter = any> extends Robot<TAdapter> {
    injector: Injector;
    readonly listeners: RobotListener[];
    brain: HubotFrameworkRobotBrain;

    logger: {
        debug(msg: string): void;
        info(msg: string): void;
        error(msg: string): void;
    };
}

export interface RobotListener {
    readonly options: any;
    callback(res: Hubot.Response<HubotFrameworkRobot>): void;
}

export interface HubotFrameworkRobotBrain extends Brain {
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}
