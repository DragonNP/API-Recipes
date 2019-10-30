require('colors');

let isDebug,
    isInfo,
    isErr;

module.exports = {
    setLevel,
    debug,
    info,
    err
};

function setLevel(level) {
    if (typeof level !== 'string')
        throw new TypeError('\'level\' must be a string');

    switch (level) {
        case 'debug':
            isDebug = true;
            isInfo = true;
            isErr = true;
            break;
        case 'info':
            isDebug = false;
            isInfo = true;
            isErr = true;
            break;
        case 'err':
            isDebug = false;
            isInfo = false;
            isErr = true;
            break;
    }
}

function debug(msg) {
    if (!isDebug) return;

    console.log('DEBUG:'.blue, msg);
}

function info(msg) {
    if (!isInfo) return '';

    console.log('INFO:'.green, msg);
}

function err(msg) {
    if (!isErr) return;

    console.log('ERR:'.red, new Error(msg).message);
}