import nodeModule from './node.js';

export const LoggerInstance = nodeModule.LoggerInstance;
export const createLogger = nodeModule.createLogger;
export const LOG_LEVELS = nodeModule.LOG_LEVELS;
export const dateFormat = nodeModule.dateFormat;
export const dateFormatSimply = nodeModule.dateFormatSimply;
export const level = nodeModule.level;
export const getAutoThread = nodeModule.getAutoThread;
export const getCallerModule = nodeModule.getCallerModule;

export const logger = nodeModule.logger;
export const setLevel = nodeModule.setLevel;
export const trace = nodeModule.trace;
export const debug = nodeModule.debug;
export const info = nodeModule.info;
export const warn = nodeModule.warn;
export const error = nodeModule.error;
export const fatal = nodeModule.fatal;

export const traceAdv = nodeModule.traceAdv;
export const debugAdv = nodeModule.debugAdv;
export const infoAdv = nodeModule.infoAdv;
export const warnAdv = nodeModule.warnAdv;
export const errorAdv = nodeModule.errorAdv;
export const fatalAdv = nodeModule.fatalAdv;
export const close = nodeModule.close;

export default nodeModule;
