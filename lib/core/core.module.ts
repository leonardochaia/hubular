import { HubularModule } from '../bootstrap/hubular-module.decorator';
import { robotBindingsInitializerProvider } from './hubular.initializers';
import { Logger } from './logger';
import { RobotLogger } from './robot-logger';

@HubularModule({
    providers: [
        robotBindingsInitializerProvider,
        {
            provide: Logger,
            useClass: RobotLogger,
        }
    ]
})
export class HubularCoreModule { }
