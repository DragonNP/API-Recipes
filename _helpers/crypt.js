const log = require('./logger');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

module.exports = {
    crypt,
    compare
};

function crypt(data, fn) {
    log.debug('crypt: called crypt method');

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return fn(null, err);
        bcrypt.hash(data, salt, fn);
    });
}

function compare(data, hash, fn) {
    log.debug('crypt: called compare method');
    bcrypt.compare(data, hash, fn);
}