import { InjectionToken } from 'injection-js';
import { Brain } from 'hubot';
import { HubularRobot } from './hubular-robot.model';

export const ROBOT = new InjectionToken<HubularRobot>('ROBOT');
export const BRAIN = new InjectionToken<Brain>('BRAIN');
