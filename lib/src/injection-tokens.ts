import { InjectionToken } from 'injection-js';
import { Robot, Brain } from 'hubot';

export const ROBOT = new InjectionToken<Robot>('ROBOT');
export const BRAIN = new InjectionToken<Brain>('BRAIN');
