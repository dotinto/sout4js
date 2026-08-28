export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent';

export interface Flags {
    flags?: 'w' | 'a' | string;
}

export interface LoggerOptions {
    /** Minimum level to log. Messages below this level are ignored. Default: 'trace' */
    minLevel?: LogLevel;
    /** Directory path to save log files (Node.js only) */
    logsPath?: string;
    /** File write mode ('w' for overwrite, 'a' for append) or flags object. Default: 'w' */
    flags?: 'w' | 'a' | string | Flags;
    /** Whether to colorize console output. Default: true */
    colors?: boolean;
    /** Output format: 'text' or 'json'. Default: 'text' */
    format?: 'text' | 'json';
}

export declare class LoggerInstance {
    constructor(options?: LoggerOptions);
    minLevelValue: number;
    isLoggerInitialized: boolean;
    setLevel(level: LogLevel): void;
    logger(logsPath: string, flags?: 'w' | 'a' | string | Flags): void;
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    fatal(...args: any[]): void;
    traceAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    debugAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    infoAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    warnAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    errorAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    fatalAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    close(): void;
}

export declare class WebLoggerInstance {
    constructor(options?: LoggerOptions);
    minLevelValue: number;
    setLevel(level: LogLevel): void;
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    fatal(...args: any[]): void;
    traceAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    debugAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    infoAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    warnAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    errorAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
    fatalAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
}

export declare const LOG_LEVELS: {
    readonly trace: 10;
    readonly debug: 20;
    readonly info: 30;
    readonly warn: 40;
    readonly error: 50;
    readonly fatal: 60;
    readonly silent: 100;
};

/** Formats a Date object to `YYYY-MM-DD HH:mm:ss.SSS` */
export declare function dateFormat(date?: Date): string;

/** Formats a Date object to `YYYYMMDD-HHmmss` */
export declare function dateFormatSimply(date?: Date): string;

/** Returns ANSI or plain text badge for given level */
export declare function level(levelName: string, colored?: boolean): string;

/** Automatically resolves current thread identifier */
export declare function getAutoThread(): string;

/** Automatically resolves caller module/filename from call stack */
export declare function getCallerModule(): string;

/** Creates an independent Logger instance with custom options */
export declare function createLogger(options?: LoggerOptions): LoggerInstance;

/** Sets minimum log level on default logger */
export declare function setLevel(level: LogLevel): void;

/** Initializes file logging for default logger */
export declare function logger(logsPath: string, flags?: 'w' | 'a' | string | Flags): void;

export declare function trace(...args: any[]): void;
export declare function debug(...args: any[]): void;
export declare function info(...args: any[]): void;
export declare function warn(...args: any[]): void;
export declare function error(...args: any[]): void;
export declare function fatal(...args: any[]): void;

export declare function traceAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
export declare function debugAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
export declare function infoAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
export declare function warnAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
export declare function errorAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;
export declare function fatalAdv(message: any, thread?: any, module?: any, useLegacyMethod?: boolean, ...extraArgs: any[]): void;

export declare function close(): void;

export declare const isLoggerInitialized: boolean;

declare const sout4js: {
    LoggerInstance: typeof LoggerInstance;
    createLogger: typeof createLogger;
    LOG_LEVELS: typeof LOG_LEVELS;
    dateFormat: typeof dateFormat;
    dateFormatSimply: typeof dateFormatSimply;
    level: typeof level;
    getAutoThread: typeof getAutoThread;
    getCallerModule: typeof getCallerModule;
    isLoggerInitialized: boolean;
    logger: typeof logger;
    setLevel: typeof setLevel;
    trace: typeof trace;
    debug: typeof debug;
    info: typeof info;
    warn: typeof warn;
    error: typeof error;
    fatal: typeof fatal;
    traceAdv: typeof traceAdv;
    debugAdv: typeof debugAdv;
    infoAdv: typeof infoAdv;
    warnAdv: typeof warnAdv;
    errorAdv: typeof errorAdv;
    fatalAdv: typeof fatalAdv;
    close: typeof close;
    default: typeof sout4js;
};

export default sout4js;
