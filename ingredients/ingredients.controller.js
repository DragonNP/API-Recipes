const db = require('db');
const log = require('_helpers/logger');
const Double = require('mongodb').Double;

module.exports = {
    get,
    add,
    update
};

async function get(request, response, next) {
    log.info('ingredients.controller: called getInfo method');
    if (!request.body || !request.body.name)
        return next('invalid json');

    db.getIngredient(request.body.name, (err, result) => {
        if(err) return next(err);
        response.json(result);
    });
}

async function add(request, response, next) {
    log.info('ingredients.controller: called addInfo method');

    const body = request.body;
    const params = {
        calories: Double(body.calories),
        name: body.name,
    };

    if (!body.calories ||
        !body.name)
        return next('invalid json');

    db.getIngredient(params.name, (err, result) => {
        if(err) return next(err);
        if(result) return next('ingredient already exists');

        db.addIngredient(params, (err, result) => {
            if(err) return next(err);
            response.json({ ok: result.result.ok });
        });
    });
}

async function update(request, response, next) {
    log.info('ingredients.controller: called update method');

    const params = {
        name: request.name
    };

    if (!request.body.name)
        return next('invalid json');

    db.updateIngredient(params, request.body, (err, result) => {
        if (err) return next(err);
        response.json({ok: result.ok});
    })
}