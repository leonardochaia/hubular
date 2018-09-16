import { OpaqueToken } from 'injection-js';

export const ROBOT = new OpaqueToken('ROBOT');
export const BRAIN = new OpaqueToken('BRAIN');

export const MODULE_INITIALIZER = new OpaqueToken('MODULE_INITIALIZER');
export const AFTER_BOOTSTRAP = new OpaqueToken('AFTERP_BOOTSTRAP');
