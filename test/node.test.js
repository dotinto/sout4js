const { describe, it, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sout4js = require('../node/node.js');
const { createLogger, dateFormat, dateFormatSimply, level, LOG_LEVELS } = sout4js;

describe('sout4js Node.js Logger', () => {
    let originalConsoleLog;
    let originalConsoleError;
    let originalConsoleWarn;
    let originalConsoleInfo;
    let originalConsoleDebug;
    let originalConsoleTrace;
    let capturedLogs = [];

    beforeEach(() => {
        capturedLogs = [];
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        originalConsoleWarn = console.warn;
        originalConsoleInfo = console.info;
        originalConsoleDebug = console.debug;
        originalConsoleTrace = console.trace;

        console.log = (...args) => capturedLogs.push({ type: 'log', args });
        console.error = (...args) => capturedLogs.push({ type: 'error', args });
        console.warn = (...args) => capturedLogs.push({ type: 'warn', args });
        console.info = (...args) => capturedLogs.push({ type: 'info', args });
        console.debug = (...args) => capturedLogs.push({ type: 'debug', args });
        console.trace = (...args) => capturedLogs.push({ type: 'trace', args });
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
        console.info = originalConsoleInfo;
        console.debug = originalConsoleDebug;
        console.trace = originalConsoleTrace;
    });

    describe('Date Formatting', () => {
        it('should format full timestamp correctly', () => {
            const fixedDate = new Date(2026, 9, 5, 14, 8, 9, 45); // Oct 5, 2026
            const result = dateFormat(fixedDate);
            assert.equal(result, '2026-10-05 14:08:09.045');
        });

        it('should format simple timestamp for filenames correctly', () => {
            const fixedDate = new Date(2026, 11, 25, 9, 5, 1, 0); // Dec 25, 2026
            const result = dateFormatSimply(fixedDate);
            assert.equal(result, '20261225-090501');
        });

        it('should handle all 12 months with correct two-digit padding', () => {
            for (let m = 0; m < 12; m++) {
                const d = new Date(2026, m, 1, 0, 0, 0, 0);
                const formatted = dateFormat(d);
                const expectedMonth = String(m + 1).padStart(2, '0');
                assert.ok(
                    formatted.startsWith(`2026-${expectedMonth}-01`),
                    `Month ${m + 1} expected 2026-${expectedMonth}-01, got ${formatted}`
                );
            }
        });

        it('should handle millisecond padding variations', () => {
            const d1 = new Date(2026, 0, 1, 0, 0, 0, 7);
            assert.ok(dateFormat(d1).endsWith('.007'));

            const d2 = new Date(2026, 0, 1, 0, 0, 0, 42);
            assert.ok(dateFormat(d2).endsWith('.042'));

            const d3 = new Date(2026, 0, 1, 0, 0, 0, 999);
            assert.ok(dateFormat(d3).endsWith('.999'));
        });

        it('should generate dynamic timestamps on consecutive calls', async () => {
            const t1 = dateFormat();
            await new Promise((r) => setTimeout(r, 20));
            const t2 = dateFormat();
            assert.notEqual(t1, t2);
        });
    });

    describe('Log Badges and Levels', () => {
        it('should provide ANSI badges when colored is true', () => {
            assert.ok(level('info', true).includes('INFO'));
            assert.ok(level('info', true).includes('\x1b[32m'));
        });

        it('should provide plain text badges when colored is false', () => {
            assert.equal(level('info', false), 'INFO ');
            assert.equal(level('warn', false), 'WARN ');
            assert.equal(level('error', false), 'ERROR');
        });
    });

    describe('Basic Logging Methods', () => {
        it('should log trace message', () => {
            sout4js.trace('trace message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('TRACE'));
            assert.ok(capturedLogs[0].args[0].includes('trace message'));
        });

        it('should log debug message', () => {
            sout4js.debug('debug message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('DEBUG'));
            assert.ok(capturedLogs[0].args[0].includes('debug message'));
        });

        it('should log info message', () => {
            sout4js.info('info message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('INFO'));
            assert.ok(capturedLogs[0].args[0].includes('info message'));
        });

        it('should log warn message', () => {
            sout4js.warn('warn message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('WARN'));
            assert.ok(capturedLogs[0].args[0].includes('warn message'));
        });

        it('should log error message', () => {
            sout4js.error('error message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('ERROR'));
            assert.ok(capturedLogs[0].args[0].includes('error message'));
        });

        it('should log fatal message', () => {
            sout4js.fatal('fatal message');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('FATAL'));
            assert.ok(capturedLogs[0].args[0].includes('fatal message'));
        });
    });

    describe('Multi-argument and Object Formatting', () => {
        it('should support logging objects and formatting them', () => {
            const logger = createLogger({ colors: false });
            logger.info('User payload:', { id: 101, name: 'Alice' });
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('User payload:'));
            assert.ok(capturedLogs[0].args[0].includes('Alice'));
            assert.ok(capturedLogs[0].args[0].includes('101'));
        });

        it('should format Error instances with stack trace', () => {
            const logger = createLogger({ colors: false });
            const testError = new Error('Something went wrong');
            logger.error(testError);
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('Something went wrong'));
            assert.ok(capturedLogs[0].args[0].includes('Error: Something went wrong'));
        });
    });

    describe('Adv Logging Methods', () => {
        it('should include thread and module info with useLegacyMethod = false', () => {
            sout4js.infoAdv('adv info message', 'main-thread', 'auth-module', false);
            assert.equal(capturedLogs.length, 1);
            const msg = capturedLogs[0].args[0];
            assert.ok(msg.includes('[main-thread]'));
            assert.ok(msg.includes('auth-module'));
            assert.ok(msg.includes('adv info message'));
        });

        it('should auto-resolve thread and caller module when omitted', () => {
            sout4js.infoAdv('auto thread and module test', undefined, undefined, false);
            assert.equal(capturedLogs.length, 1);
            const msg = capturedLogs[0].args[0];
            // thread should auto resolve to [main]
            assert.ok(msg.includes('[main]'));
            // module should auto resolve to node.test.js
            assert.ok(msg.includes('node.test.js') || msg.includes('node.js'));
            assert.ok(msg.includes('auto thread and module test'));
        });

        it('should support custom non-string thread and module (numbers, objects)', () => {
            sout4js.infoAdv('number thread test', 0, 404, false);
            assert.equal(capturedLogs.length, 1);
            const msg = capturedLogs[0].args[0];
            assert.ok(msg.includes('[0]'));
            assert.ok(msg.includes('404'));
        });

        it('should call corresponding console method when useLegacyMethod is true', () => {
            sout4js.warnAdv('legacy warn', 'worker-1', 'db', true);
            assert.equal(capturedLogs.length, 1);
            assert.equal(capturedLogs[0].type, 'warn');
            assert.ok(capturedLogs[0].args[0].includes('[worker-1]'));
            assert.ok(capturedLogs[0].args[0].includes('db'));
        });
    });

    describe('Instance Creation and Log Level Filtering', () => {
        it('should filter out logs below configured minLevel', () => {
            const logger = createLogger({ minLevel: 'warn', colors: false });

            logger.trace('ignore trace');
            logger.debug('ignore debug');
            logger.info('ignore info');
            assert.equal(capturedLogs.length, 0);

            logger.warn('keep warn');
            logger.error('keep error');
            logger.fatal('keep fatal');

            assert.equal(capturedLogs.length, 3);
            assert.ok(capturedLogs[0].args[0].includes('WARN'));
            assert.ok(capturedLogs[1].args[0].includes('ERROR'));
            assert.ok(capturedLogs[2].args[0].includes('FATAL'));
        });

        it('should support dynamic setLevel', () => {
            const logger = createLogger({ minLevel: 'error', colors: false });
            logger.info('before setLevel');
            assert.equal(capturedLogs.length, 0);

            logger.setLevel('info');
            logger.info('after setLevel');
            assert.equal(capturedLogs.length, 1);
            assert.ok(capturedLogs[0].args[0].includes('after setLevel'));
        });

        it('should support JSON formatting mode', () => {
            const logger = createLogger({ format: 'json' });
            logger.info('Test json output');
            assert.equal(capturedLogs.length, 1);
            const parsed = JSON.parse(capturedLogs[0].args[0]);
            assert.equal(parsed.level, 'INFO');
            assert.ok(parsed.timestamp);
            assert.equal(parsed.message, 'Test json output');
        });
    });

    describe('File Logging', () => {
        const testLogsDir = path.join(__dirname, '..', 'tmp_test_logs', 'nested');

        after(() => {
            const rootTmp = path.join(__dirname, '..', 'tmp_test_logs');
            if (fs.existsSync(rootTmp)) {
                fs.rmSync(rootTmp, { recursive: true, force: true });
            }
        });

        it('should create log directory recursively and write log files', async () => {
            const logger = createLogger({
                logsPath: testLogsDir,
                colors: false
            });

            logger.info('File write test line 1');
            logger.error('File write test line 2');

            // Allow stream write to flush
            await new Promise((r) => setTimeout(r, 100));
            logger.close();

            assert.ok(fs.existsSync(testLogsDir));
            const files = fs.readdirSync(testLogsDir);
            assert.ok(files.length > 0);

            const logContent = fs.readFileSync(path.join(testLogsDir, files[0]), 'utf-8');
            assert.ok(logContent.includes('INFO  - File write test line 1'));
            assert.ok(logContent.includes('ERROR - File write test line 2'));
            // Ensure no leading empty line
            assert.ok(!logContent.startsWith('\n'));
        });
    });
});
