const db = require('db');
const log = require('_helpers/logger');

module.exports = {
    pack,
    addPack,
    updatePack
};

async function pack(request, response, next) {
    log.info('lang.controller: called langPack method');

    if (!request.body || !request.body.lang)
        return next('invalid json');

    db.getPackLang(request.body.lang, (err, result) => {
        if(err) return next(err);
        response.json(result);
    });
}

async function addPack(request, response, next) {
    log.info('lang.controller: called addPack method');

    if (!request.body)
        return next('invalid json');

    db.addPackLang(request.body, (err, result) => {
        if(err) return next(err);
        response.json({ ok: result.ok });
    });
}

async function updatePack(request, response, next) {
    log.info('lang.controller: called updatePack method');

    if (!request.body || !request.body.lang)
        return next('invalid json');

    db.updatePackLang({lang: request.body.lang}, request.body, (err, result) => {
        if(err) return next(err);
        response.json(result.value);
    });
}