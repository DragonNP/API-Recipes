const log = require('./logger');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        log.err(err);
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        log.err('Invalid Token');
        return res.status(401).json({ message: 'Invalid Token' });
    }

    log.err(err.message);
    return res.status(500).json({ message: err.message });
}