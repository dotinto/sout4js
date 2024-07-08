function dateFormat() {
    return `${new Date().getFullYear()}-${
        (new Date().getMonth() < 10) ? "0" + (new Date().getMonth()+1) : new Date().getMonth()
    }-${
        (new Date().getDate() < 10) ? "0" + new Date().getDate() : new Date().getDate()
    } ${
        (new Date().getHours() < 10) ? "0" + new Date().getHours() : new Date().getHours()
    }:${
        (new Date().getMinutes() < 10) ? "0" + new Date().getMinutes() : new Date().getMinutes()
    }:${
        (new Date().getSeconds() < 10) ? "0" + new Date().getSeconds() : new Date().getSeconds()
    }.${new Date().getMilliseconds()}`
}

module.exports = {
    // simple methods
    trace(message) {
        console.log(`${dateFormat()} \x1b[30;47mTRACE\x1b[0m - ${message}`)
    },
    debug(message) {
        console.log(`${dateFormat()} \x1b[34mDEBUG\x1b[0m - ${message}`)
    },
    info(message) {
        console.log(`${dateFormat()} \x1b[32mINFO \x1b[0m - ${message}`)
    },
    warn(message) {
        console.log(`${dateFormat()} \x1b[33mWARN \x1b[0m - ${message}`)
    },
    error(message) {
        console.log(`${dateFormat()} \x1b[31mERROR\x1b[0m - ${message}`)
    },
    fatal(message) {
        console.log(`${dateFormat()} \x1b[31mFATAL\x1b[0m - ${message}`)
    },
    // advanced methods
    traceAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[30;47mTRACE\x1b[0m ${module} - ${message}`)
    },
    debugAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[34mDEBUG\x1b[0m ${module} - ${message}`)
    },
    infoAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[32mINFO \x1b[0m ${module} - ${message}`)
    },
    warnAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[33mWARN \x1b[0m ${module} - ${message}`)
    },
    errorAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[31mERROR\x1b[0m ${module} - ${message}`)
    },
    fatalAdv(message, thread, module) {
        console.log(`${dateFormat()} [${thread}] \x1b[31mFATAL\x1b[0m ${module} - ${message}`)
    },
}