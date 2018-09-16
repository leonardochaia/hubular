import { Robot, Brain, Response } from 'hubot';
import { EventEmitter } from 'events';
import { Injectable } from 'injection-js';

@Injectable()
export class HubularRobot<TAdapter = any> extends Robot<TAdapter> {
    public brain: HubularRobotBrain = null as any;

    public catchAll(fn: (res: Response<this>) => void) {
        return;
    }
}

export interface HubularRobotBrain extends Brain, EventEmitter {
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
    setAutoSave(status: boolean): void;
    mergeData(data: any): void;
}
