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

    console.log('--------DEBUG-------');
    console.log(msg);
    console.log('---------END--------');
}

function info(msg) {
    if (!isInfo) return '';

    console.log('--------INFO--------');
    console.log(msg);
    console.log('---------END--------');
}

function warn(msg) {
    if (!isWarn) return;

    console.log('--------WARN--------');
    console.log(msg);
    console.log('---------END--------');
}

function err(msg) {
    if (!isErr) return;

    console.log('---------ERR--------');
    console.log(new Error(msg));
    console.log('---------END--------');
}