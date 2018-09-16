import { Injectable } from 'injection-js';
import { HubularRobot } from '../core/hubular-robot.model';
import { Logger } from '../core/logger';

@Injectable()
export class RobotLogger implements Logger {

    private get logger() {
        return (this.robot as any).logger as {
            debug(msg: string): void;
            info(msg: string): void;
            error(msg: string): void;
        };
    }

    private prefix = '';

    constructor(
        private robot: HubularRobot) { }

    public info(msg: string) {
        this.logger.info(this.prefix + msg);
    }

    public debug(msg: string) {
        this.logger.debug(this.prefix + msg);
    }

    public error(msg: string) {
        this.logger.error(this.prefix + msg);
    }

    public for(prefix: string) {
        const logger = new RobotLogger(this.robot);
        logger.prefix = prefix;
        if (!logger.prefix.endsWith(' ')) {
            logger.prefix += ' ';
        }
        return logger;
    }
}
