const db = require('db');
const dateFormat = require('dateformat');
const ObjectID = require('mongodb').ObjectID;
const log = require('_helpers/logger');

module.exports = {
    add,
    deleteById,
    addFavourites,
    my,
    all,
    byId,
    byAccountId
};

async function add(request, response, next) {
    log.info('recipes.controller: called add method');

    const body = request.body;
    const date = dateFormat(new Date(), "dd-mm-yyyy");
    const params = {
        token: body.token
    };

    if (!body.token ||
        !body.name ||
        !body.numberIngredients ||
        !body.instruction)
        return next('invalid json');

    let ingredients = [];
    for (let i = 0; i < body.numberIngredients; i++)
        ingredients.push([body[`name_${i}`],
            body[`value_${i}`],
            body[`unit_${i}`]]);

    db.getUser(params, (err, result) => {
        if(err) return next(err);
        if(!result) return  next('invalid token');

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
    log.info('recipes.controller: called deleteByID method');

    const body = request.body;
    const token = body.token;
    const id = body.id;
    const params = {
        token: token
    };
    const params2 = {
        _id: ObjectID(id)
    };

    if(!token || !id)
        return next('invalid json');

    db.getUser(params, (err, result) => {
        if(err) return next(err);

        const recipes = result.recipes;
        if(!recipes.find(_id => String(_id) === id))
            return next('forbidden');

        recipes.splice(recipes.indexOf(ObjectID(id)), 1);
        const update_values = {
          recipes: recipes
        };

        db.updateUser(params, update_values, (err, result) => {
            if(err) return next(err)
        });
        db.deleteRecipe(params2, (err, result) => {
           if(err) return next(err);
           response.json({ ok: result.result.ok});
        });
    })
}

async function addFavourites(request, response, next) {
    log.info('recipes.controller: called addFavourites method');

    const body = request.body;
    const token = body.token;
    const recipe_id = body.id;
    const params = {
        token: token
    };

    if (!token ||
        !recipe_id)
        return next('invalid json');

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
    log.info('recipes.controller: called myRecipes method');

    const body = request.body;
    const params = {
        token: body.token
    };
    const params2 = {};

    if(!body.token) return next('invalid token');

    db.getUser(params, (err, result) => {
        if(err) return next(err);
        if(!result) return next('token not found');

        params2.account_id = result._id;

        db.getRecipes(params2, (err, result) => {
            if(err) return next(err);

            response.json(result);
        });
    });
}

async function all(request, response, next) {
    log.info('recipes.controller: called all method');

    db.getRecipes({}, (err, result) => {
        if(err) return next(err);
        response.json(result)
    });
}

async function byId(request, response, next) {
    log.info('recipes.controller: called byId method');

    const body = request.body;
    const id = body.id;

    if (!body.id) return next('invalid json');

    return db.getRecipeById(id, (err, result) => {
        if (err) return next(err);
        if (!result) return next('recipes not found');

        response.json(result);
    });
}

async function byAccountId(request, response, next) {
    log.info('recipes.controller: called byAccountId method');

    const body = request.body;
    const params = {
        account_id: ObjectID(body.id)
    };

    if(!body.id) return next('invalid json');

    db.getRecipes(params, (err, result) => {
        if(err) return next(err);
        if(!result) return next('recipes not found');

        response.json(result);
    });
}