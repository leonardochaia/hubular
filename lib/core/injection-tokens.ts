import { OpaqueToken } from 'injection-js';

export const BEFORE_BOOTSTRAP = new OpaqueToken('BEFORE_BOOTSTRAP');
export const MODULE_INITIALIZER = new OpaqueToken('MODULE_INITIALIZER');
export const AFTER_BOOTSTRAP = new OpaqueToken('AFTER_BOOTSTRAP');
