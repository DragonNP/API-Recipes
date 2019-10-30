const db = require('db');
const dateFormat = require('dateformat');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    add,
    deleteByID,
    addFavourites,
    getAllOrById
};

function add(request, response, next) {
    const body = request.body;
    const date = dateFormat(new Date(), "yyyy-mm-dd h:MM");
    const params = {
        token: body.token
    };

    if (!body.token ||
        !body.name ||
        !body.ingredients ||
        !body.instruction)
        return next('invalid json');

    db.getUser(params, (err, result) => {
        if(err) return next(err);
        if(!result._id) return  next('invalid token');

        const account_id = result._id;
        const recipes = result.recipes;
        const recipe = {
            path_img: '',
            name: body.name,
            description: '',
            ingredients: body.ingredients,
            instruction: body.instruction,
            date: date,
            account_id: account_id,
        };

        if (body.description) recipe.description = body.description;
        if (body.path_img) recipe.path_img = body.path_img;

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

function deleteByID(request, response, next) {
    const body = request.body;
    const token = body.token;
    const id = body.id;
    const params = {
        token: token
    };
    const params2 = {
        _id: ObjectID(id)
    };

    if(!token ||
        !id)
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

function addFavourites(request, response, next) {
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

function getAllOrById(request, response, next) {
    if (request.body.id)
        return getById(request, response, next);
    if (request.body.account_id)
        return getByAccountID(request, response, next);
    if (!request.body.id &&
        !request.body.account_id)
        return getAll(request, response, next);

    return next('invalid json');
}


function getAll(request, response, next) {
    db.getRecipes({}, (err, result) => {
        if(err) return next(err);
        response.json(result)
    });
}

function getById(request, response, next) {
    const body = request.body;

    db.getRecipeById(body.id, (err, result) => {
        if(err) return next(err);
        if(!result) return next('invalid id');

        response.json(result);
    });
}

function getByAccountID(request, response, next) {
    const body = request.body;
    const params = {
        account_id: ObjectID(body.account_id)
    };

    db.getRecipes(params, (err, result) => {
        if(err) return next(err);
        if(!result) return next('invalid account id');

        response.json(result);
    });
}