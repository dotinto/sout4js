(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.sout4js = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
    'use strict';

    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

    function getAutoThread() {
        if (typeof window !== 'undefined') return 'main';
        if (typeof self !== 'undefined' && self.name) return self.name;
        return 'worker';
    }

    function getCallerModule() {
        try {
            const stack = new Error().stack;
            if (stack) {
                const lines = stack.split('\n');
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line.includes('web.js') && !line.includes('web.min.js') && !line.includes('sout4js')) {
                        const match = line.match(/(https?:\/\/[^\s\)\/]+\/)?([^\s\)\?#:]+)/);
                        if (match && match[2]) {
                            const parts = match[2].split('/');
                            return parts[parts.length - 1] || 'app';
                        }
                    }
                }
            }
        } catch (_) {}
        return 'app';
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

    const BROWSER_STYLES = {
        trace: 'background: #64748b; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px;',
        debug: 'background: #0284c7; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px;',
        info: 'background: #16a34a; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px;',
        warn: 'background: #d97706; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px;',
        error: 'background: #dc2626; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px;',
        fatal: 'background: #7f1d1d; color: #ffffff; padding: 1px 5px; border-radius: 3px; font-weight: bold; font-size: 11px;'
    };

    const ANSI_STYLES = {
        trace: '\x1b[30;47mTRACE\x1b[0m',
        debug: '\x1b[34mDEBUG\x1b[0m',
        info: '\x1b[32mINFO \x1b[0m',
        warn: '\x1b[33mWARN \x1b[0m',
        error: '\x1b[31mERROR\x1b[0m',
        fatal: '\x1b[31mFATAL\x1b[0m'
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
            return ANSI_STYLES[key] || levelName.toUpperCase();
        }
        return levelName.toUpperCase();
    }

    class WebLoggerInstance {
        constructor(options = {}) {
            this.options = {
                minLevel: 'trace',
                colors: true,
                ...options
            };
            this.minLevelValue = LOG_LEVELS[String(this.options.minLevel).toLowerCase()] ?? LOG_LEVELS.trace;
        }

        setLevel(levelName) {
            const key = String(levelName).toLowerCase();
            if (LOG_LEVELS[key] !== undefined) {
                this.options.minLevel = key;
                this.minLevelValue = LOG_LEVELS[key];
            }
        }

        _shouldLog(levelName) {
            const value = LOG_LEVELS[levelName] ?? 0;
            return value >= this.minLevelValue;
        }

        _log(levelName, consoleFn, args) {
            if (!this._shouldLog(levelName)) return;
            const ts = dateFormat();
            const badgeKey = String(levelName).toLowerCase();

            if (isBrowser && this.options.colors) {
                const style = BROWSER_STYLES[badgeKey] || '';
                const tag = levelName.toUpperCase();
                consoleFn(`%c${ts}%c %c${tag}%c -`, 'color: #94a3b8; font-size: 11px;', '', style, '', ...args);
            } else if (this.options.colors) {
                const badge = ANSI_STYLES[badgeKey] || levelName.toUpperCase();
                consoleFn(`${ts} ${badge} -`, ...args);
            } else {
                consoleFn(`${ts} ${levelName.toUpperCase()} -`, ...args);
            }
        }

        _logAdv(levelName, message, thread, moduleName, useLegacyMethod = true, extraArgs = []) {
            if (!this._shouldLog(levelName)) return;
            const ts = dateFormat();
            const badgeKey = String(levelName).toLowerCase();
            const actualThread = (thread !== undefined && thread !== null) ? thread : getAutoThread();
            const actualModule = (moduleName !== undefined && moduleName !== null) ? moduleName : getCallerModule();
            const threadStr = `[${actualThread}] `;
            const moduleStr = `${actualModule} `;
            const allArgs = extraArgs.length > 0 ? [message, ...extraArgs] : [message];

            let consoleFn = console.log;
            if (useLegacyMethod) {
                const consoleFnMap = {
                    trace: console.trace,
                    debug: console.debug,
                    info: console.info,
                    warn: console.warn,
                    error: console.error,
                    fatal: console.error
                };
                consoleFn = consoleFnMap[levelName] || console.log;
            }

            if (isBrowser && this.options.colors) {
                const style = BROWSER_STYLES[badgeKey] || '';
                const tag = levelName.toUpperCase();
                consoleFn(`%c${ts}%c ${threadStr}%c${tag}%c ${moduleStr}-`, 'color: #94a3b8; font-size: 11px;', '', style, '', ...allArgs);
            } else if (this.options.colors) {
                const badge = ANSI_STYLES[badgeKey] || levelName.toUpperCase();
                consoleFn(`${ts} ${threadStr}${badge} ${moduleStr}-`, ...allArgs);
            } else {
                consoleFn(`${ts} ${threadStr}${levelName.toUpperCase()} ${moduleStr}-`, ...allArgs);
            }
        }

        trace(...args) {
            this._log('trace', console.log, args);
        }

        debug(...args) {
            this._log('debug', console.log, args);
        }

        info(...args) {
            this._log('info', console.log, args);
        }

        warn(...args) {
            this._log('warn', console.log, args);
        }

        error(...args) {
            this._log('error', console.log, args);
        }

        fatal(...args) {
            this._log('fatal', console.log, args);
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
    }

    const defaultWebLogger = new WebLoggerInstance();

    function createLogger(options) {
        return new WebLoggerInstance(options);
    }

    const sout4js = {
        WebLoggerInstance,
        createLogger,
        LOG_LEVELS,
        dateFormat,
        dateFormatSimply,
        level,
        getAutoThread,
        getCallerModule,

        setLevel(levelName) {
            defaultWebLogger.setLevel(levelName);
        },

        trace(...args) {
            defaultWebLogger.trace(...args);
        },

        debug(...args) {
            defaultWebLogger.debug(...args);
        },

        info(...args) {
            defaultWebLogger.info(...args);
        },

        warn(...args) {
            defaultWebLogger.warn(...args);
        },

        error(...args) {
            defaultWebLogger.error(...args);
        },

        fatal(...args) {
            defaultWebLogger.fatal(...args);
        },

        traceAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.traceAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        },

        debugAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.debugAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        },

        infoAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.infoAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        },

        warnAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.warnAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        },

        errorAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.errorAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        },

        fatalAdv(message, thread, moduleName, useLegacyMethod = true, ...extraArgs) {
            defaultWebLogger.fatalAdv(message, thread, moduleName, useLegacyMethod, ...extraArgs);
        }
    };

    sout4js.default = sout4js;
    return sout4js;
});