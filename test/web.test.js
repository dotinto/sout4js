const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const sout4jsWeb = require('../web/web.js');

describe('sout4js Web Logger', () => {
    let originalConsoleLog;
    let originalConsoleWarn;
    let originalConsoleError;
    let capturedLogs = [];

    beforeEach(() => {
        capturedLogs = [];
        originalConsoleLog = console.log;
        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;

        console.log = (...args) => capturedLogs.push({ type: 'log', args });
        console.warn = (...args) => capturedLogs.push({ type: 'warn', args });
        console.error = (...args) => capturedLogs.push({ type: 'error', args });
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
    });

    it('should export all standard logging methods', () => {
        const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'traceAdv', 'debugAdv', 'infoAdv', 'warnAdv', 'errorAdv', 'fatalAdv'];
        for (const m of methods) {
            assert.equal(typeof sout4jsWeb[m], 'function');
        }
    });

    it('should log messages in web module', () => {
        sout4jsWeb.info('Browser info test');
        assert.equal(capturedLogs.length, 1);
        assert.ok(capturedLogs[0].args.some(a => typeof a === 'string' && a.includes('INFO')));
    });

    it('should support web createLogger with level filtering', () => {
        const logger = sout4jsWeb.createLogger({ minLevel: 'error' });
        logger.info('Should be ignored');
        assert.equal(capturedLogs.length, 0);

        logger.error('Should be logged');
        assert.equal(capturedLogs.length, 1);
    });

    it('should support web *Adv methods', () => {
        sout4jsWeb.infoAdv('Adv web msg', 'ui-thread', 'header', false);
        assert.equal(capturedLogs.length, 1);
        const joined = capturedLogs[0].args.map(String).join(' ');
        assert.ok(joined.includes('[ui-thread]'));
        assert.ok(joined.includes('header'));
        assert.ok(joined.includes('Adv web msg'));
    });

    it('should support non-string thread and module in web logger', () => {
        sout4jsWeb.infoAdv('Adv number test', 1, 200, false);
        assert.equal(capturedLogs.length, 1);
        const joined = capturedLogs[0].args.map(String).join(' ');
        assert.ok(joined.includes('[1]'));
        assert.ok(joined.includes('200'));
    });
});
