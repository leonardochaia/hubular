import { InjectionToken } from 'injection-js';
import { Brain } from 'hubot';
import { HubotFrameworkRobot } from './model';

export const ROBOT = new InjectionToken<HubotFrameworkRobot>('ROBOT');
export const BRAIN = new InjectionToken<Brain>('BRAIN');
