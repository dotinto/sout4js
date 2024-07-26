const fs = require('node:fs')

function dateFormat(){var e=new Date().getMilliseconds();return`${new Date().getFullYear()}-${10>new Date().getMonth()?"0"+(new Date().getMonth()+1):new Date().getMonth()}-${10>new Date().getDate()?"0"+new Date().getDate():new Date().getDate()} ${10>new Date().getHours()?"0"+new Date().getHours():new Date().getHours()}:${10>new Date().getMinutes()?"0"+new Date().getMinutes():new Date().getMinutes()}:${10>new Date().getSeconds()?"0"+new Date().getSeconds():new Date().getSeconds()}.${(()=>{switch(String(e).length){case 1:return`00${e}`;case 2:return`0${e}`;case 3:return`${e}`}})()}`}function dateFormatSimply(){return`${new Date().getFullYear()}${10>new Date().getMonth()?"0"+(new Date().getMonth()+1):new Date().getMonth()}${10>new Date().getDate()?"0"+new Date().getDate():new Date().getDate()}-${10>new Date().getHours()?"0"+new Date().getHours():new Date().getHours()}${10>new Date().getMinutes()?"0"+new Date().getMinutes():new Date().getMinutes()}${10>new Date().getSeconds()?"0"+new Date().getSeconds():new Date().getSeconds()}`}function level(e){switch(e){case"trace":return`\x1b[30;47mTRACE\x1b[0m`;case"debug":return`\x1b[34mDEBUG\x1b[0m`;case"info":return`\x1b[32mINFO \x1b[0m`;case"warn":return`\x1b[33mWARN \x1b[0m`;case"error":return`\x1b[31mERROR\x1b[0m`;case"fatal":return`\x1b[31mFATAL\x1b[0m`}}

let isLoggerInitialized = false
let logFileStream;

module.exports = {
    logger(logsPath, flags) {
        if (!logsPath) {
            throw new Error('"logsPath" is required');
        }
        isLoggerInitialized = true

        if (!fs.existsSync(logsPath)) {
            fs.mkdirSync(logsPath)
        }

        logFileStream = fs.createWriteStream(logsPath + '/' + dateFormatSimply() + '.log', flags);
        process.on('beforeExit', () => {
            logFileStream.close()
        })
    },
    
    trace(message) {
        console.log(`${dateFormat()} ${level("trace")} - ${message}`);
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} TRACE - ${message}`}`) : null
    },

    debug(message) {
        console.log(`${dateFormat()} ${level("debug")} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} DEBUG - ${message}`}`) : null
    },

    info(message) {
        console.log(`${dateFormat()} ${level("info")} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} INFO - ${message}`}`) : null
    },

    warn(message) {
        console.log(`${dateFormat()} ${level("warn")} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} WARN - ${message}`}`) : null
    },

    error(message) {
        console.log(`${dateFormat()} ${level("error")} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} ERROR - ${message}`}`) : null
    },

    fatal(message) {
        console.log(`${dateFormat()} ${level("fatal")} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} FATAL - ${message}`}`) : null
    },

    
    traceAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("trace")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] TRACE ${module} - ${message}`}`) : null
    },

    debugAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("debug")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] DEBUG ${module} - ${message}`}`) : null
    },

    infoAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("info")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] INFO  ${module} - ${message}`}`) : null
    },

    warnAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("warn")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] WARN  ${module} - ${message}`}`) : null
    },

    errorAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("error")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] ERROR ${module} - ${message}`}`) : null
    },

    fatalAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] ${level("fatal")} ${module} - ${message}`);
        
        (isLoggerInitialized) ? logFileStream.write(`
${`${dateFormat()} [${thread}] FATAL ${module} - ${message}`}`) : null
    },
}