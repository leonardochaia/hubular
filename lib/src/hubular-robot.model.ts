import { Robot, Brain } from 'hubot';
import { Injector } from 'injection-js';

export interface HubularRobot<TAdapter = any> extends Robot<TAdapter> {
    injector: Injector;
    readonly listeners: HubularRobotListener[];
    readonly brain: HubularRobotBrain;

    logger: {
        debug(msg: string): void;
        info(msg: string): void;
        error(msg: string): void;
    };
}

export interface HubularRobotListener {
    readonly options: any;
    callback(res: Hubot.Response<HubularRobot>): void;
}

export interface HubularRobotBrain extends Brain {
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}
