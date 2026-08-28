const fs = require('node:fs');
const path = require('node:path');
const util = require('node:util');

let isMainThread = true;
let threadId = 0;
try {
    const worker_threads = require('node:worker_threads');
    isMainThread = worker_threads.isMainThread;
    threadId = worker_threads.threadId;
} catch (_) {}

function getAutoThread() {
    return isMainThread ? 'main' : `worker-${threadId}`;
}

function getCallerModule() {
    try {
        const origPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const err = new Error();
        const stack = err.stack;
        Error.prepareStackTrace = origPrepareStackTrace;

        if (Array.isArray(stack)) {
            for (let i = 0; i < stack.length; i++) {
                const fileName = stack[i].getFileName();
                if (
                    fileName &&
                    !fileName.includes('node:internal') &&
                    !fileName.endsWith(path.join('node', 'node.js')) &&
                    !fileName.endsWith(path.join('node', 'node.mjs')) &&
                    !fileName.endsWith(path.join('src', 'index.js')) &&
                    !fileName.endsWith(path.join('src', 'index.mjs')) &&
                    !fileName.endsWith('node.js') &&
                    !fileName.endsWith('node.mjs')
                ) {
                    return path.basename(fileName);
                }
            }
        }
    } catch (_) {}

    try {
        const stack = new Error().stack;
        if (stack) {
            const lines = stack.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (
                    !line.includes('node:internal') &&
                    !line.includes('node.js') &&
                    !line.includes('node.mjs') &&
                    !line.includes('sout4js')
                ) {
                    const match = line.match(/(?:at\s+(?:.*?\s+\()?)?([^\(\):]+):(\d+):(\d+)\)?/);
                    if (match && match[1]) {
                        const cleanPath = match[1].trim();
                        return path.basename(cleanPath);
                    }
                }
            }
        }
    } catch (_) {}

    return 'main';
}

const LOG_LEVELS = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
    silent: 100
};

const ANSI_BADGES = {
    trace: '\x1b[30;47mTRACE\x1b[0m',
    debug: '\x1b[34mDEBUG\x1b[0m',
    info: '\x1b[32mINFO \x1b[0m',
    warn: '\x1b[33mWARN \x1b[0m',
    error: '\x1b[31mERROR\x1b[0m',
    fatal: '\x1b[31mFATAL\x1b[0m'
};

const PLAIN_BADGES = {
    trace: 'TRACE',
    debug: 'DEBUG',
    info: 'INFO ',
    warn: 'WARN ',
    error: 'ERROR',
    fatal: 'FATAL'
};

function dateFormat(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}.${ms}`;
}

function dateFormatSimply(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}${m}${d}-${h}${min}${s}`;
}

function level(levelName, colored = true) {
    const key = String(levelName).toLowerCase();
    if (colored) {
        return ANSI_BADGES[key] || levelName.toUpperCase();
    }
    return PLAIN_BADGES[key] || levelName.toUpperCase();
}

function formatArgsForConsole(args, colors = true) {
    if (args.length === 0) return '';
    if (args.length === 1) {
        const item = args[0];
        if (typeof item === 'string') return item;
        if (item instanceof Error) return item.stack || item.message;
        return util.inspect(item, { colors, depth: null, compact: false });
    }
    return util.formatWithOptions({ colors }, ...args);
}

function formatArgsForFile(args) {
    if (args.length === 0) return '';
    if (args.length === 1) {
        const item = args[0];
        if (typeof item === 'string') return item;
        if (item instanceof Error) return item.stack || item.message;
        return util.inspect(item, { colors: false, depth: null, compact: false });
    }
    return util.formatWithOptions({ colors: false }, ...args);
}

class LoggerInstance {
    constructor(options = {}) {
        this.options = {
            minLevel: 'trace',
            colors: true,
            format: 'text',
            ...options
        };

        this.minLevelValue = LOG_LEVELS[String(this.options.minLevel).toLowerCase()] ?? LOG_LEVELS.trace;
        this.isLoggerInitialized = false;
        this.logFileStream = null;

        if (this.options.logsPath) {
            this.initFileLogger(this.options.logsPath, this.options.flags);
        }
    }

    setLevel(levelName) {
        const key = String(levelName).toLowerCase();
        if (LOG_LEVELS[key] !== undefined) {
            this.options.minLevel = key;
            this.minLevelValue = LOG_LEVELS[key];
        }
    }

    initFileLogger(logsPath, flags = 'w') {
        if (!logsPath) {
            throw new Error('"logsPath" is required');
        }

        if (!fs.existsSync(logsPath)) {
            fs.mkdirSync(logsPath, { recursive: true });
        }

        const flagOption = typeof flags === 'object' && flags ? flags : { flags: flags || 'w' };
        const fileName = `${dateFormatSimply()}.log`;
        const filePath = path.join(logsPath, fileName);

        if (this.logFileStream) {
            try {
                this.logFileStream.end();
            } catch (_) {}
        }

        this.logFileStream = fs.createWriteStream(filePath, flagOption);
        this.isLoggerInitialized = true;

        this._exitHandler = () => {
            if (this.logFileStream) {
                try {
                    this.logFileStream.end();
                } catch (_) {}
            }
        };

        process.once('beforeExit', this._exitHandler);
    }

    logger(logsPath, flags) {
        this.initFileLogger(logsPath, flags);
    }

    _shouldLog(levelName) {
        const value = LOG_LEVELS[levelName] ?? 0;
        return value >= this.minLevelValue;
    }

    _writeLog(levelName, consoleOutput, fileOutput, rawArgs = []) {
        if (this.options.format === 'json') {
            const entry = {
                timestamp: new Date().toISOString(),
                level: levelName.toUpperCase(),
                message: formatArgsForFile(rawArgs)
            };
            const jsonStr = JSON.stringify(entry);
            console.log(jsonStr);
            if (this.isLoggerInitialized && this.logFileStream) {
                this.logFileStream.write(jsonStr + '\n');
            }
            return;
        }

        console.log(consoleOutput);

        if (this.isLoggerInitialized && this.logFileStream) {
            this.logFileStream.write(fileOutput + '\n');
        }
    }

    trace(...args) {
        if (!this._shouldLog('trace')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('trace', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} TRACE - ${msgFile}`;
        this._writeLog('trace', consoleOut, fileOut, args);
    }

    debug(...args) {
        if (!this._shouldLog('debug')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('debug', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} DEBUG - ${msgFile}`;
        this._writeLog('debug', consoleOut, fileOut, args);
    }

    info(...args) {
        if (!this._shouldLog('info')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('info', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} INFO  - ${msgFile}`;
        this._writeLog('info', consoleOut, fileOut, args);
    }

    warn(...args) {
        if (!this._shouldLog('warn')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('warn', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} WARN  - ${msgFile}`;
        this._writeLog('warn', consoleOut, fileOut, args);
    }

    error(...args) {
        if (!this._shouldLog('error')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('error', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} ERROR - ${msgFile}`;
        this._writeLog('error', consoleOut, fileOut, args);
    }

    fatal(...args) {
        if (!this._shouldLog('fatal')) return;
        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(args, this.options.colors);
        const msgFile = formatArgsForFile(args);
        const consoleOut = `${ts} ${level('fatal', this.options.colors)} - ${msgConsole}`;
        const fileOut = `${ts} FATAL - ${msgFile}`;
        this._writeLog('fatal', consoleOut, fileOut, args);
    }

    _logAdv(levelName, message, thread, moduleName, useLegacyMethod = true, extraArgs = []) {
        if (!this._shouldLog(levelName)) return;
        const allArgs = extraArgs.length > 0 ? [message, ...extraArgs] : [message];

        const actualThread = (thread !== undefined && thread !== null) ? thread : getAutoThread();
        const actualModule = (moduleName !== undefined && moduleName !== null) ? moduleName : getCallerModule();

        if (this.options.format === 'json') {
            const entry = {
                timestamp: new Date().toISOString(),
                level: levelName.toUpperCase(),
                thread: actualThread,
                module: actualModule,
                message: formatArgsForFile(allArgs)
            };
            const jsonStr = JSON.stringify(entry);
            console.log(jsonStr);
            if (this.isLoggerInitialized && this.logFileStream) {
                this.logFileStream.write(jsonStr + '\n');
            }
            return;
        }

        const ts = dateFormat();
        const msgConsole = formatArgsForConsole(allArgs, this.options.colors);
        const msgFile = formatArgsForFile(allArgs);
        const lvlBadge = level(levelName, this.options.colors);
        const plainBadge = level(levelName, false);
        const threadStr = `[${actualThread}] `;
        const moduleStr = `${actualModule} `;

        const consoleOut = `${ts} ${threadStr}${lvlBadge} ${moduleStr}- ${msgConsole}`;
        const fileOut = `${ts} ${threadStr}${plainBadge} ${moduleStr}- ${msgFile}`;

        if (useLegacyMethod) {
            const consoleFnMap = {
                trace: console.trace,
                debug: console.debug,
                info: console.info,
                warn: console.warn,
                error: console.error,
                fatal: console.error
            };
            const consoleFn = consoleFnMap[levelName] || console.log;
            consoleFn(consoleOut);
        } else {
            console.log(consoleOut);
        }

        if (this.isLoggerInitialized && this.logFileStream) {
            this.logFileStream.write(fileOut + '\n');
        }
    }

    traceAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('trace', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    debugAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('debug', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    infoAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('info', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    warnAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('warn', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    errorAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('error', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    fatalAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        this._logAdv('fatal', message, thread, moduleName, useLegacyMethod, extraArgs);
    }

    close() {
        if (this.logFileStream) {
            try {
                this.logFileStream.end();
            } catch (_) {}
            this.logFileStream = null;
            this.isLoggerInitialized = false;
        }
        if (this._exitHandler) {
            process.removeListener('beforeExit', this._exitHandler);
        }
    }
}

// Global default singleton instance for full backward compatibility
const defaultLogger = new LoggerInstance();

function createLogger(options) {
    return new LoggerInstance(options);
}

const sout4js = {
    LoggerInstance,
    createLogger,
    LOG_LEVELS,
    dateFormat,
    dateFormatSimply,
    level,
    getAutoThread,
    getCallerModule,

    get isLoggerInitialized() {
        return defaultLogger.isLoggerInitialized;
    },

    logger(logsPath, flags) {
        defaultLogger.logger(logsPath, flags);
    },

    setLevel(levelName) {
        defaultLogger.setLevel(levelName);
    },

    trace(...args) {
        defaultLogger.trace(...args);
    },

    debug(...args) {
        defaultLogger.debug(...args);
    },

    info(...args) {
        defaultLogger.info(...args);
    },

    warn(...args) {
        defaultLogger.warn(...args);
    },

    error(...args) {
        defaultLogger.error(...args);
    },

    fatal(...args) {
        defaultLogger.fatal(...args);
    },

    traceAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.traceAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    debugAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.debugAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    infoAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.infoAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    warnAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.warnAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    errorAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.errorAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    fatalAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
        defaultLogger.fatalAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
    },

    close() {
        defaultLogger.close();
    }
};

sout4js.default = sout4js;
module.exports = sout4js;