const sout4js = require('./node/node.js');
const { createLogger } = sout4js;

console.log('=== Default Singleton Logger Demo ===');
sout4js.trace('This is a TRACE message');
sout4js.debug('This is a DEBUG message');
sout4js.info('This is an INFO message');
sout4js.warn('This is a WARN message');
sout4js.error('This is an ERROR message');
sout4js.fatal('This is a FATAL message');

console.log('\n=== Multi-Argument & Object Demo ===');
sout4js.info('User connected:', { id: 42, username: 'admin', roles: ['root', 'dev'] });

console.log('\n=== Advanced (Adv) Method Demo ===');
sout4js.infoAdv('Database connected successfully', 'main', 'DB_POOL', false);
sout4js.warnAdv('Slow query detected (240ms)', 'worker-3', 'QUERY_RUNNER', false);
sout4js.infoAdv('Auto-filled thread & caller module (omitted params)', undefined, undefined, false);

console.log('\n=== Custom Logger with Level Filtering Demo ===');
const prodLogger = createLogger({ minLevel: 'warn' });
prodLogger.debug('This debug message will NOT appear');
prodLogger.warn('Warning: High memory usage');
prodLogger.error('Critical failure in worker!');

console.log('\n=== JSON Format Logger Demo ===');
const jsonLogger = createLogger({ format: 'json' });
jsonLogger.info('Structured JSON log event');