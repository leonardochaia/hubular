// tslint:disable:max-classes-per-file

declare module 'hubot' {
    class TextMessage {
        constructor(user: any, msg: string);
    }
}

import 'reflect-metadata';
import { Robot, TextMessage } from 'hubot';

export type adapterEventCallback = (envelope: any, msgs: string[]) => void;

export class RobotMessageAwaiter {

    constructor(private readonly robotMock: RobotMock) { }

    public onSend(fn: adapterEventCallback) {
        return this.bindToAdapter('send', fn);

    }

    public onReply(fn: adapterEventCallback) {
        return this.bindToAdapter('reply', fn);
    }

    protected bindToAdapter(event: string, fn: adapterEventCallback) {
        return new Promise((resolve) => {
            this.robotMock.robot.adapter.on(event, (envelope: any, strings: any) => {
                fn(envelope, strings);
                resolve();
            });
        });
    }
}

export class RobotMock {

    public readonly robot: any = new Robot(null as any, 'mock-adapter-v3', false, 'hubot');
    public readonly testUser: any;

    constructor() {
        this.robot.adapter.on('connected', () => {
            this.robot.brain.userForId('1', {
                name: 'john',
                real_name: 'John Doe',
                room: '#test'
            });
        });
        this.robot.run();
        this.testUser = this.robot.brain.userForName('john');
    }

    public sendMessage(msg: string) {
        this.robot.adapter.receive(new TextMessage(this.testUser, msg));
        return new RobotMessageAwaiter(this);
    }

    public dispose() {
        this.robot.shutdown();
    }
}
