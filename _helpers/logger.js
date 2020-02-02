const chalk = require('chalk');

let isDebug, isInfo, isErr;

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
    console.log('[' + getTimeNow() + '] ' + chalk.blue('✓') + ' ' + msg);
}

function info(msg) {
    if (!isInfo) return;
    console.log('[' + getTimeNow() + '] ' + chalk.green('✓') + ' ' + msg);
}

function err(msg) {
    if (!isErr) return;
    console.log('[' + getTimeNow() + '] ' + chalk.red('✗') + ' ' + new Error(msg).message);
}

function getTimeNow() {
    const date_ob = new Date();
    const date = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}