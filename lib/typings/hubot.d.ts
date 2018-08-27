// Type definitions for hubot 2.19
// Project: https://github.com/github/hubot
// Definitions by: Dirk Gadsden <https://github.com/dirk>
//                 Kees C. Bakker <https://github.com/KeesCBakker>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'hubot' {
    class Brain {
        userForId(id: any): any;
        userForName(name: string): any;
        get<T>(key: string): T;
        set<T>(key: string, value: T): void;
    }

    class User {
        id: any;
        name: string;
    }

    class Message {
        user: User;
        text: string;
        id: string;
    }

    class Response<R> {
        match: RegExpMatchArray;
        message: Message;

        constructor(robot: R, message: Message, match: RegExpMatchArray);
        send(...strings: string[]): void;
        reply(...strings: string[]): void;
        emote(...strings: string[]): void;
        random<T>(items: T[]): T;
    }

    type ListenerCallback<R> = (response: Response<R>) => void;

    class Robot<TAdapter = any> {
        readonly alias: string;
        readonly brain: Brain;
        readonly name: string;
        readonly adapter: TAdapter;
        readonly listeners: Listener[];

        readonly logger: Logger;

        constructor(adapterPath: string, adapter: string, httpd: boolean, name: string, alias?: string);
        hear(regex: RegExp, callback: ListenerCallback<this>): void;
        hear(regex: RegExp, options: any, callback: ListenerCallback<this>): void;
        helpCommands(): string[];
        load(directory: string): void;
        loadFile(directory: string, fileName: string): void;
        respond(regex: RegExp, callback: ListenerCallback<this>): void;
        respond(regex: RegExp, options: any, callback: ListenerCallback<this>): void;
    }

    class Listener {
        readonly options: any;
    }

    class Logger {
        debug(msg: string): void;
        info(msg: string): void;
        error(msg: string): void;
    }
}