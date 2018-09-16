import { Robot, Brain } from 'hubot';
import { Injector } from 'injection-js';
import { EventEmitter } from 'events';

export interface HubularRobot<TAdapter = any> extends Robot<TAdapter> {
    injector: Injector;
    readonly brain: HubularRobotBrain;

    logger: {
        debug(msg: string): void;
        info(msg: string): void;
        error(msg: string): void;
    };
}

export interface HubularRobotBrain extends Brain, EventEmitter {
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
    setAutoSave(status: boolean): void;
    mergeData(data: any): void;
}
