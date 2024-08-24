const nd = new Date();

function dateFormat(){var e=nd.getMilliseconds();return`${nd.getFullYear()}-${10>nd.getMonth()?"0"+(nd.getMonth()+1):nd.getMonth()}-${10>nd.getDate()?"0"+nd.getDate():nd.getDate()} ${10>nd.getHours()?"0"+nd.getHours():nd.getHours()}:${10>nd.getMinutes()?"0"+nd.getMinutes():nd.getMinutes()}:${10>nd.getSeconds()?"0"+nd.getSeconds():nd.getSeconds()}.${(()=>{switch(String(e).length){case 1:return`00${e}`;case 2:return`0${e}`;case 3:return`${e}`}})()}`}
function level(e){switch(e){case"trace":return`\x1b[30;47mTRACE\x1b[0m`;case"debug":return`\x1b[34mDEBUG\x1b[0m`;case"info":return`\x1b[32mINFO \x1b[0m`;case"warn":return`\x1b[33mWARN \x1b[0m`;case"error":return`\x1b[31mERROR\x1b[0m`;case"fatal":return`\x1b[31mFATAL\x1b[0m`}}

const sout4js = {

    trace(message) {
        console.log(`${dateFormat()} ${level("trace")} - ${message}`);
    },

    debug(message) {
        console.log(`${dateFormat()} ${level("debug")} - ${message}`);
    },

    info(message) {
        console.log(`${dateFormat()} ${level("info")} - ${message}`);
    },

    warn(message) {
        console.log(`${dateFormat()} ${level("warn")} - ${message}`);
    },

    error(message) {
        console.log(`${dateFormat()} ${level("error")} - ${message}`);
    },

    fatal(message) {
        console.log(`${dateFormat()} ${level("fatal")} - ${message}`);
    },

    
    traceAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.trace : console.log )(`${dateFormat()} [${thread}] ${level("trace")} ${module} - ${message}`);
    },

    debugAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.debug : console.log )(`${dateFormat()} [${thread}] ${level("debug")} ${module} - ${message}`);
    },

    infoAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.info : console.log )(`${dateFormat()} [${thread}] ${level("info")} ${module} - ${message}`);
    },

    warnAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.warn : console.log )(`${dateFormat()} [${thread}] ${level("warn")} ${module} - ${message}`);
    },

    errorAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.error : console.log )(`${dateFormat()} [${thread}] ${level("error")} ${module} - ${message}`);
    },

    fatalAdv(message, thread, module, useLegacyMethod = true) {
        ((useLegacyMethod) ? console.error : console.log )(`${dateFormat()} [${thread}] ${level("fatal")} ${module} - ${message}`);
    },
}