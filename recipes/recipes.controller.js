const dateFormat = require('dateformat');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const log = require('../_helpers/logger');

module.exports = {
    add,
    deleteById,
    addFavourites,
    my,
    all,
    id,
    accountId
};

async function add(request, response, next) {
    log.debug('recipes.controller: called add method');

    if (!request.body.token ||
        !request.body.name ||
        !request.body.numberIngredients ||
        !request.body.instruction)
        return next('invalid json');

    const body = request.body;
    const date = dateFormat(new Date(), "dd-mm-yyyy");
    const params = {
        token: body.token
    };

    let ingredients = [];
    for (let i = 0; i <= body.numberIngredients; i++)
        ingredients.push([body[`name_${i}`],
            body[`value_${i}`],
            body[`unit_${i}`]]);

    db.getUser(params, (err, result) => {
        if(err) return next(err);
        if(!result) return next('invalid token');

        const account_id = result._id;
        const recipes = result.recipes;
        const recipe = {
            img_path: '',
            name: body.name,
            description: '',
            ingredients: ingredients,
            instruction: body.instruction,
            date: date,
            account_id: account_id,
        };

        if (body.description) recipe.description = body.description;
        if (body.img_path) recipe.img_path = body.img_path;

        db.addRecipe(recipe, (err, result) => {
            if (err) return next(err);

            recipes.push(ObjectID(result._id));
            const update_values = {
                recipes: recipes
            };

            db.updateUserById(account_id, update_values, (err, result) => {
                if (err) return next(err);
            });
            response.json({ id: result._id});
        });
    });
}

async function deleteById(request, response, next) {
    log.debug('recipes.controller: called deleteByID method');

    if(!token || !id)
        return next('invalid json');

    const body = request.body;
    const token = body.token;
    const id = body.id;
    const params = {
        token: token
    };
    const params2 = {
        _id: ObjectID(id)
    };

    db.getUser(params, (err, result) => {
        if(err) return next(err);

        const recipes = result.recipes;
        if(!recipes.find(_id => String(_id) === id))
            return next('forbidden');

        recipes.splice(recipes.indexOf(ObjectID(id)), 1);
        const update_values = {
          recipes: recipes
        };

        db.updateUser(params, update_values, (err) => {
            if(err) return next(err)
        });
        db.deleteRecipe(params2, (err, result) => {
           if(err) return next(err);
           response.json({ ok: result.result.ok});
        });
    })
}

async function addFavourites(request, response, next) {
    log.debug('recipes.controller: called addFavourites method');

    if (!request.body.token ||
        !request.body.recipe_id)
        return next('invalid json');

    const body = request.body;
    const recipe_id = body.id;
    const params = {
        token: body.token
    };

    db.getUser(params, (err, result) => {
        if(err) return next(err);

        const favourites = result.favourites;
        if (favourites.find(r => String(r) === recipe_id))
            return next('this is recipe is favourites');

        favourites.push(ObjectID(recipe_id));
        const update_values = {
          favourites: favourites
        };

        db.updateUser(params, update_values, (err, result) => {
            if(err) return next(err);
            response.json({ok: result.ok});
        })
    });
}

async function my(request, response, next) {
    log.debug('recipes.controller: called myRecipes method');

    if(!request.body.token) return next('invalid token');
    if(!request.body.skip) request.body.skip = 0;
    if(!request.body.limit) request.body.limit = 0;

    const params = {
        token: request.body.token
    };
    const params2 = {};
    const skip = Number(request.body.skip);
    const limit = Number(request.body.limit);

    db.getUser(params, (err, result) => {
        if(err) return next(err);
        if(!result) return next('token not found');

        params2.account_id = result._id;

        db.getRecipes(params2, skip, limit, (err, result) => {
            if(err) return next(err);
            response.json(result);
        });
    });
}

async function all(request, response, next) {
    log.debug('recipes.controller: called all method');

    if(!request.body.skip) request.body.skip = 0;
    if(!request.body.limit) request.body.limit = 0;

    const skip = Number(request.body.skip);
    const limit = Number(request.body.limit);

    db.getRecipes({}, skip, limit, (err, result) => {
        if(err) return next(err);
        response.json(result)
    });
}

async function id(request, response, next) {
    log.debug('recipes.controller: called byId method');

    const body = request.body;
    const id = body.id;

    if (!body.id) return next('invalid json');

    return db.getRecipeById(id, (err, result) => {
        if (err) return next(err);
        if (!result) return next('recipe not found');

        response.json(result);
    });
}

async function accountId(request, response, next) {
    log.debug('recipes.controller: called byAccountId method');

    if(!request.body.id) return next('invalid json');
    if(!request.body.skip) request.body.skip = 0;
    if(!request.body.limit) request.body.limit = 0;

    const params = {
        account_id: ObjectID(body.id)
    };
    const skip = Number(request.body.skip);
    const limit = Number(request.body.limit);

    db.getRecipes(params, skip, limit, (err, result) => {
        if(err) return next(err);

        response.json(result);
    });
}