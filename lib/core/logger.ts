// tslint:disable:no-empty
export abstract class Logger {
    public info(msg: string) {
    }

    public debug(msg: string) {
    }

    public error(msg: string) {
    }

    public for(prefix: string): Logger {
        return this;
    }
}
