const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Module Exports & Interop', () => {
    it('should import root CommonJS cleanly', () => {
        const sout4js = require('../src/index.js');
        assert.equal(typeof sout4js.info, 'function');
        assert.equal(typeof sout4js.createLogger, 'function');
        assert.equal(typeof sout4js.default.info, 'function');
    });

    it('should import node CommonJS cleanly', () => {
        const sout4js = require('../node/node.js');
        assert.equal(typeof sout4js.info, 'function');
        assert.equal(typeof sout4js.createLogger, 'function');
    });

    it('should import web CommonJS cleanly', () => {
        const sout4js = require('../web/web.js');
        assert.equal(typeof sout4js.info, 'function');
        assert.equal(typeof sout4js.createLogger, 'function');
    });

    it('should dynamically import root ESM cleanly', async () => {
        const esmModule = await import('../src/index.mjs');
        assert.equal(typeof esmModule.info, 'function');
        assert.equal(typeof esmModule.createLogger, 'function');
        assert.equal(typeof esmModule.default.info, 'function');
    });

    it('should dynamically import node ESM cleanly', async () => {
        const esmModule = await import('../node/node.mjs');
        assert.equal(typeof esmModule.info, 'function');
        assert.equal(typeof esmModule.createLogger, 'function');
    });

    it('should dynamically import web ESM cleanly', async () => {
        const esmModule = await import('../web/web.mjs');
        assert.equal(typeof esmModule.info, 'function');
        assert.equal(typeof esmModule.createLogger, 'function');
    });
});
