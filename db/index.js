const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const log = require('_helpers/logger');

const uri = "mongodb+srv://Recipes-API-User:58pP2X0Lm8RjWxrR@cluster0-sooyn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbClient;
let collectionUsers;
let collectionRecipes;
let collectionLang;
let collectionIngredients;

module.exports = {
    // Connect and close db
    connect,
    close,

    // Users
    addUser,
    getUser,
    getUsers,
    getUserById,
    updateUser,
    updateUserById,
    deleteUser,

    // Recipes
    addRecipe,
    getRecipeById,
    getRecipes,
    updateRecipe,
    deleteRecipe,

    // Ingredients
    getIngredient,
    addIngredient,
    updateIngredient,

    // Lang
    getPackLang,
    addPackLang,
    updatePackLang
};

// Connect and close db
function connect(fn) {
    log.info('db: connecting to db...');

    mongoClient.connect()
        .then(client => {
            const database = client.db('apidb');
            const dbCollectionUsers = database.collection('users');
            const dbCollectionRecipes = database.collection('recipes');
            const dbCollectionIngredients = database.collection('ingredients');
            const dbCollectionLang = database.collection('lang');

            dbClient = client;
            collectionUsers = dbCollectionUsers;
            collectionRecipes = dbCollectionRecipes;
            collectionIngredients = dbCollectionIngredients;
            collectionLang = dbCollectionLang;

            log.debug('dbClient initialized');
            log.debug('collectionUsers, collectionRecipes, collectionIngredients, collectionLang initialized');
            log.info('connecting is successful');

            fn()
        }).catch(err => log.err(err));
}

function close() {
    if(dbClient) {
        log.info('closing dbClient');
        return dbClient.close();
    }
    log.err('db is not connecting')
}

// Users
function addUser(user, fn) {
    log.info('db: called method addUser');

    collectionUsers.insertOne(user, fn);
}

function getUser(params, fn) {
    log.info('db: called method getUser');
    collectionUsers.findOne(params, fn);
}

function getUserById(id, fn) {
    log.info('db: called method getUserById');
    collectionUsers.findOne(
        ObjectID(id),
        fn
    );
}

function getUsers(params, fn) {
    log.info('db: called method getUsers');
    collectionUsers.find(params).toArray(fn);
}

function updateUser(params, update_values, fn) {
    log.info('db: called method updateUser');
    collectionUsers.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}

function updateUserById(id, update_values, fn) {
    log.info('db: called method updateUserById');
    collectionUsers.findOneAndUpdate(
        {_id: ObjectID(id)},
        { $set: update_values},
        fn
    );
}

function deleteUser(params, fn) {
    log.info('db: called method deleteUser');
    collectionUsers.deleteOne(params, fn)
}

// Recipes
function addRecipe(recipe, fn) {
    log.info('db: called method addRecipe');
    collectionRecipes.insertOne(recipe, (err, result) => {
        log.debug(`err:${err} ok:${result.result.ok}`);
        fn(err, result.ops[0]);
    });
}

function getRecipeById(id, fn) {
    log.info('db: called method getRecipeById');
    collectionRecipes.findOne(
        ObjectID(id),
        fn
    );
}

function getRecipes(params, fn) {
    log.info('db: called method getRecipes');
    collectionRecipes.find(params).toArray(fn);
}

function updateRecipe(params, update_values, fn) {
    log.info('db: called method updateUser');
    collectionRecipes.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}

function deleteRecipe(params, fn) {
    log.info('db: called method deleteRecipe');
    collectionRecipes.deleteOne(params, fn)
}

// Ingredients
function getIngredient(name, fn) {
    log.info('db: called method getIngredient');
    collectionIngredients.findOne(
        {name: name},
        fn
    );
}

function addIngredient(params, fn) {
    log.info('db: called method addIngredient');
    collectionIngredients.insertOne(params, fn)
}

function updateIngredient(params, update_values, fn) {
    log.info('db: called method updateIngredient');
    collectionIngredients.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}


// Language
function getPackLang(lang, fn) {
    log.info('db: called method getPackLang');
    collectionLang.findOne(
        {lang: lang},
        fn
    );
}

function addPackLang(params, fn) {
    log.info('db: called method addPackLang');
    collectionLang.insertOne(params, fn)
}

function updatePackLang(params, update_values, fn) {
    log.info('db: called method updatePackLang');
    collectionLang.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}