const db = require('db');
const log = require('_helpers/logger');

module.exports = {
    byLang,
    all,
    add,
    update
};

async function byLang(request, response, next) {
    log.info('lang.controller: called get method');

    if (!request.body || !request.body.lang)
        return next('invalid json');

    db.getPackLang(request.body.lang, (err, result) => {
        if(err) return next(err);
        response.json(result);
    });
}

async function all(request, response, next) {
    log.info('lang.controller: called all method');

    db.getPacksLang(request.body || {}, (err, result) => {
        if(err) return next(err);
        response.json(result);
    });
}

async function add(request, response, next) {
    log.info('lang.controller: called add method');

    if (!request.body)
        return next('invalid json');

    db.addPackLang(request.body, (err, result) => {
        if(err) return next(err);
        response.json({ ok: result.ok });
    });
}

async function update(request, response, next) {
    log.info('lang.controller: called update method');

    if (!request.body || !request.body.lang)
        return next('invalid json');

    db.updatePackLang({lang: request.body.lang}, request.body, (err, result) => {
        if(err) return next(err);
        response.json(result.value);
    });
}