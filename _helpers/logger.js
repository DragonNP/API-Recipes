const colors = require('colors');

let isDebug,
    isInfo,
    isWarn,
    isErr;

module.exports = {
    setLevel,
    debug,
    info,
    warn,
    err
};

function setLevel(level) {
    if (typeof level !== 'string')
        throw new TypeError('\'level\' must be a string');

    switch (level) {
        case 'debug':
            isDebug = true;
            isInfo = true;
            isWarn = true;
            isErr = true;
            break;
        case 'info':
            isDebug = false;
            isInfo = true;
            isWarn = true;
            isErr = true;
            break;
        case 'warn':
            isDebug = false;
            isInfo = false;
            isWarn = true;
            isErr = true;
            break;
        case 'err':
            isDebug = false;
            isInfo = false;
            isWarn = true;
            isErr = true;
            break;
    }
}

function debug(msg) {
    if (!isDebug) return;

    console.log('DEBUG:'.green, msg);
}

function info(msg) {
    if (!isInfo) return '';

    console.log('INFO:'.white, msg);
}

function warn(msg) {
    if (!isWarn) return;

    console.log('WARN:'.yellow, msg);
}

function err(msg) {
    if (!isErr) return;

    console.log('ERR:'.red, new Error(msg).message);
}