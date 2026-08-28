# @dxtintx/sout4js

[![npm version](https://img.shields.io/npm/v/@dxtintx/sout4js.svg)](https://www.npmjs.com/package/@dxtintx/sout4js)
[![License](https://img.shields.io/npm/l/@dxtintx/sout4js.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/node/v/@dxtintx/sout4js.svg)](https://nodejs.org)

Fast, lightweight, and versatile logger for **Node.js** and the **Web** with colored output, file logging, multiple arguments, structured JSON mode, and full TypeScript support.

---

## ✨ Features

- 🎨 **Beautiful Colored Output**: High-visibility ANSI badges in terminal/CLI and CSS-styled badges in browser consoles.
- ⚡ **Zero Dependencies**: Pure JavaScript, lightning-fast execution.
- 📦 **Dual ESM & CommonJS**: Works seamlessly with `import` and `require`.
- 🌐 **Universal Runtime**: Node.js, Web Browsers, Bun, Deno, Electron, and Edge environments.
- 🕒 **Accurate Dynamic Timestamps**: Precision timestamps (`YYYY-MM-DD HH:mm:ss.SSS`) updated on every log call.
- 📝 **Built-in File Logging**: Write to log files with automatic recursive directory creation and clean formatting.
- 🧩 **Multi-Argument & Object Inspection**: Pass strings, objects, numbers, and `Error` objects with full stack traces.
- 🎚️ **Log Level Filtering**: Configure threshold levels (`trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`).
- 🏭 **Custom Logger Instances**: Create isolated logger instances using `createLogger()` with independent configurations.
- 📊 **Structured JSON Mode**: Easily export logs as JSON for log aggregators (Datadog, ELK, CloudWatch).
- 🛡️ **Full TypeScript Support**: Shipped with complete, accurate `.d.ts` declaration files.
- 🔄 **100% Backward Compatible**: Full drop-in replacement for existing sout4js 2.x setups.

---

## 📦 Installation

### Node.js (npm / pnpm / yarn)

```bash
npm install @dxtintx/sout4js
# or
pnpm add @dxtintx/sout4js
# or
yarn add @dxtintx/sout4js
```

### Browser (CDN)

```html
<!-- Full version -->
<script src="https://cdn.jsdelivr.net/npm/@dxtintx/sout4js/web/web.js"></script>

<!-- Or Minified -->
<script src="https://cdn.jsdelivr.net/npm/@dxtintx/sout4js/web/web.min.js"></script>
```

---

## 🚀 Quick Start

### Node.js (CommonJS)

```javascript
const sout4js = require('@dxtintx/sout4js');

// Basic logging
sout4js.trace('Tracing internal state...');
sout4js.debug('Debugging query params');
sout4js.info('Server started on port 3000');
sout4js.warn('Memory usage is high (>80%)');
sout4js.error('Database connection failed');
sout4js.fatal('Unrecoverable application crash!');

// Multi-argument and object inspection
sout4js.info('User authenticated:', { id: 101, username: 'alice', role: 'admin' });

// Error objects with stack trace
sout4js.error(new Error('Connection timeout'));
```

### Node.js / TypeScript (ESM)

```typescript
import sout4js, { info, warn, error, createLogger } from '@dxtintx/sout4js';

info('Application started successfully');
warn('Deprecation notice: Feature X will be removed in v3');
```

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@dxtintx/sout4js/web/web.min.js"></script>
<script>
    sout4js.info('App mounted');
    sout4js.warn('API latency spike detected', { duration: '650ms' });
</script>
```

---

## 📖 Advanced Usage

### 1. Advanced (Adv) Logging

Include thread names and module identifiers in your logs:

```javascript
// sout4js.infoAdv(message, thread, module, useLegacyMethod = true, ...extraArgs)
sout4js.infoAdv('Connected to pool', 'main', 'DB_CLIENT', false);
sout4js.warnAdv('Slow query response', 'worker-2', 'QUERY_RUNNER', false, { latencyMs: 240 });

// If thread and module are omitted, they are AUTO-DETECTED from the runtime & call stack!
sout4js.infoAdv('Automatic thread & caller file detection');
```

*Output:*
```text
2026-08-29 01:15:00.123 [main] INFO  DB_CLIENT - Connected to pool
2026-08-29 01:15:00.124 [worker-2] WARN  QUERY_RUNNER - Slow query response { latencyMs: 240 }
2026-08-29 01:15:00.125 [main] INFO  server.js - Automatic thread & caller file detection
```

### 2. File Logging (Node.js)

Enable file logging to automatically save formatted logs to disk:

```javascript
const sout4js = require('@dxtintx/sout4js');

// Initializes log directory and writes logs into `logs/YYYYMMDD-HHmmss.log`
sout4js.logger('logs', {
    flags: 'a' // 'a' to append, 'w' to overwrite (default: 'w')
});

sout4js.info('This log is printed to console AND written to the log file');
```

### 3. Custom Logger Instances (`createLogger`)

Create independent logger instances with custom minimum log levels, formatting, and file targets:

```javascript
const { createLogger } = require('@dxtintx/sout4js');

// Production logger: only logs warnings, errors, and fatal messages
const prodLogger = createLogger({
    minLevel: 'warn',
    logsPath: './logs/prod',
    colors: true
});

prodLogger.debug('This will be ignored');
prodLogger.info('This will also be ignored');
prodLogger.warn('This warning WILL be logged!');
prodLogger.error('This error WILL be logged!');
```

### 4. Structured JSON Mode

Ideal for cloud logging platforms (Datadog, AWS CloudWatch, ElasticSearch):

```javascript
const { createLogger } = require('@dxtintx/sout4js');

const jsonLogger = createLogger({
    format: 'json'
});

jsonLogger.info('User checkout completed', { orderId: 9812, amount: 49.99 });
```

*Output:*
```json
{"timestamp":"2026-08-29T01:15:00.123Z","level":"INFO","message":"User checkout completed { orderId: 9812, amount: 49.99 }"}
```

---

## 🛠️ Configuration & Options

### `createLogger(options)` Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `minLevel` | `LogLevel` | `'trace'` | Minimum level to log (`'trace'`, `'debug'`, `'info'`, `'warn'`, `'error'`, `'fatal'`, `'silent'`). |
| `logsPath` | `string` | `undefined` | Folder path where log files will be saved (Node.js only). |
| `flags` | `'w' \| 'a' \| Flags` | `'w'` | File write flag (`'w'` for overwrite, `'a'` for append). |
| `colors` | `boolean` | `true` | Enable or disable ANSI colors in terminal or CSS badges in browser. |
| `format` | `'text' \| 'json'` | `'text'` | Output format mode. |

---

## 📊 Log Levels

| Level | Priority | Terminal Badge | Browser Badge |
| :--- | :--- | :--- | :--- |
| `trace` | 10 | White on Black Badge | Slate Gray Badge |
| `debug` | 20 | Blue Text | Cyan/Blue Badge |
| `info` | 30 | Green Text | Green Badge |
| `warn` | 40 | Yellow Text | Amber Badge |
| `error` | 50 | Red Text | Red Badge |
| `fatal` | 60 | Red Text | Dark Red Badge |
| `silent`| 100| *(suppresses all logs)* | *(suppresses all logs)* |

---

## 🧪 Running Tests

```bash
npm test
```

To run the interactive demonstration:

```bash
npm run demo
```

---

## 📄 License

Apache License 2.0. See [LICENSE](LICENSE) for details.
