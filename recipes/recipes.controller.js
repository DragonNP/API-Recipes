const db = require('db');
const dateFormat = require('dateformat');

module.exports = {
    addRecipe,
    getAllOrById,
};

function addRecipe(request, response, next) {
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

        const recipe = {
            name: body.name,
            ingredients: body.ingredients,
            instruction: body.instruction,
            date: date,
            account_id: result._id,
        };

        if (body.path_img)
            recipe.path_img = body.path_img;

        if (body.description)
            recipe.description = body.description;

        db.addRecipe(recipe, (err, result) => {
            if (err) return next(err);

            response.json({ id: result._id});
        });
    });
}

function getAllOrById(request, response, next) {
    if (request.body.id === undefined)
        return getAll(request, response, next);

    getById(request, response, next)
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