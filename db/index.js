const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const log = require('../_helpers/logger');

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
    getPacksLang,
    addPackLang,
    updatePackLang
};

// Connect and close db
function connect(fn) {
    log.debug('db: connecting to db...');

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
            log.debug('connecting is successful');

            fn()
        }).catch(err => log.err(err));
}

function close() {
    if(dbClient) {
        log.debug('closing dbClient');
        return dbClient.close();
    }
    log.err('db is not connecting')
}

// Users
function addUser(user, fn) {
    log.debug('db: called method addUser');

    if(typeof user !== "object")
        return fn('typeof var user id not object', undefined);

    collectionUsers.insertOne(user, fn);
}

function getUser(params, fn) {
    log.debug('db: called method getUser');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionUsers.findOne(params, fn);
}

function getUserById(id, fn) {
    log.debug('db: called method getUserById');

    if(typeof id !== "string")
        return fn('typeof var id not number', undefined);

    collectionUsers.findOne(ObjectID(id), fn);
}

function getUsers(params, skip, limit, fn) {
    log.debug('db: called method getUsers');

    if(typeof skip !== "number" ||
       typeof limit !== "number")
        return fn('typeof var skip or limit not number', undefined);

    collectionUsers.find(params).skip(skip).limit(limit).toArray(fn);
}

function updateUser(params, update_values, fn) {
    log.debug('db: called method updateUser');

    if(typeof params !== "object" ||
        typeof update_values !== 'object')
        return fn('typeof var params or update_values not object', undefined);

    collectionUsers.findOneAndUpdate(params, {$set: update_values}, fn)
}

function updateUserById(id, update_values, fn) {
    log.debug('db: called method updateUserById');

    if(typeof id !== "string" ||
        typeof update_values !== 'object')
        return fn('typeof var id not string or update_values not object', undefined);

    collectionUsers.findOneAndUpdate(
        {_id: ObjectID(id)}, { $set: update_values}, fn);
}

function deleteUser(params, fn) {
    log.debug('db: called method deleteUser');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionUsers.deleteOne(params, fn)
}

// Recipes
function addRecipe(recipe, fn) {
    log.debug('db: called method addRecipe');

    if(typeof recipe !== "object")
        return fn('typeof var recipe not object', undefined);

    collectionRecipes.insertOne(recipe, (err, result) => fn(err, result.ops[0]));
}

function getRecipeById(id, fn) {
    log.debug('db: called method getRecipeById');

    if(typeof id !== "string" )
        return fn('typeof var id not string', undefined);

    collectionRecipes.findOne(ObjectID(id), fn);
}

function getRecipes(params, skip, limit, fn) {
    log.debug('db: called method getRecipes');

    if(typeof skip !== "number" ||
       typeof limit !== "number")
        return fn('typeof var skip or limit not number', undefined);

    collectionRecipes.find(params).skip(skip).limit(limit).toArray(fn);
}

function updateRecipe(params, update_values, fn) {
    log.debug('db: called method updateUser');

    if(typeof params !== "object" ||
        typeof update_values !== 'object')
        return fn('typeof var params or update_values not object', undefined);

    collectionRecipes.findOneAndUpdate(params, {$set: update_values}, fn);
}

function deleteRecipe(params, fn) {
    log.debug('db: called method deleteRecipe');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionRecipes.deleteOne(params, fn)
}

// Ingredients
function getIngredient(name, fn) {
    log.debug('db: called method getIngredient');

    if(typeof name !== "string")
        return fn('typeof var name not string', undefined);

    collectionIngredients.findOne({name: name}, fn);
}

function addIngredient(params, fn) {
    log.debug('db: called method addIngredient');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionIngredients.insertOne(params, fn)
}

function updateIngredient(params, update_values, fn) {
    log.debug('db: called method updateIngredient');

    if(typeof params !== "object" ||
        typeof update_values !== 'object')
        return fn('typeof var params or update_values not object', undefined);

    collectionIngredients.findOneAndUpdate(params, {$set: update_values}, fn);
}


// Language
function getPackLang(lang, fn) {
    log.debug('db: called method getPackLang');

    if(typeof lang !== "string")
        return fn('typeof var lang not string', undefined);

    collectionLang.findOne({lang: lang}, fn);
}

function getPacksLang(params, fn) {
    log.debug('db: called method getPacksLang');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionLang.findOne(params, fn);
}

function addPackLang(params, fn) {
    log.debug('db: called method addPackLang');

    if(typeof params !== "object")
        return fn('typeof var params not object', undefined);

    collectionLang.insertOne(params, fn)
}

function updatePackLang(params, update_values, fn) {
    log.debug('db: called method updatePackLang');

    if(typeof params !== "object" ||
        typeof update_values !== 'object')
        return fn('typeof var params or update_values not object', undefined);

    collectionLang.findOneAndUpdate(params, {$set: update_values}, fn);
}