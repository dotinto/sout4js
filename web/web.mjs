import webModule from './web.js';

export const WebLoggerInstance = webModule.WebLoggerInstance;
export const createLogger = webModule.createLogger;
export const LOG_LEVELS = webModule.LOG_LEVELS;
export const dateFormat = webModule.dateFormat;
export const dateFormatSimply = webModule.dateFormatSimply;
export const level = webModule.level;
export const getAutoThread = webModule.getAutoThread;
export const getCallerModule = webModule.getCallerModule;

export const setLevel = webModule.setLevel;
export const trace = webModule.trace;
export const debug = webModule.debug;
export const info = webModule.info;
export const warn = webModule.warn;
export const error = webModule.error;
export const fatal = webModule.fatal;

export const traceAdv = webModule.traceAdv;
export const debugAdv = webModule.debugAdv;
export const infoAdv = webModule.infoAdv;
export const warnAdv = webModule.warnAdv;
export const errorAdv = webModule.errorAdv;
export const fatalAdv = webModule.fatalAdv;

export default webModule;
