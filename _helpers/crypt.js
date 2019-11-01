const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    crypt,
    compare
};

function crypt(data, fn) {
    bcrypt.hash(data, saltRounds, fn);
}

function compare(data, hash, fn) {
    bcrypt.compare(data, hash, fn);
}