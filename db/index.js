const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const log = require('./logger');

const uri = "mongodb+srv://Recipes-API-User:58pP2X0Lm8RjWxrR@cluster0-sooyn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbClient;
let collectionUsers;
let collectionRecipes;

log.setLevel('info');

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
    deleteRecipe
};

// Connect and close db
function connect() {
    log.info('connecting to db...');

    mongoClient.connect(function (err, client) {
        if (err) return log.err(err);

        const database = client.db('apidb');
        const dbCollectionUsers = database.collection('users');
        const dbCollectionRecipes = database.collection('recipes');

        dbClient = client;
        collectionUsers = dbCollectionUsers;
        collectionRecipes = dbCollectionRecipes;

        log.debug('dbClient initialized');
        log.debug('collectionUsers initialized');
        log.debug('collectionRecipes initialized');
        log.info('connecting is successful');
    })
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
    log.info('called method addUser');
    collectionUsers.insertOne(user, function (err, result) {
        log.debug(`err:${err} ok:${result.result.ok}`);
        fn(err, result.ops[0]);
    });
}

function getUser(params, fn) {
    log.info('called method getUser');
    collectionUsers.findOne(params, fn);
}

function getUserById(id, fn) {
    log.info('called method getUserById');
    collectionUsers.findOne(
        ObjectID(id),
        fn
    );
}

function getUsers(params, fn) {
    log.info('called method getUsers');
    collectionUsers.find(params).toArray(fn);
}

function updateUser(params, update_values, fn) {
    log.info('called method updateUser');
    collectionUsers.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}

function updateUserById(id, update_values, fn) {
    log.info('called method updateUserById');
    collectionUsers.findOneAndUpdate(
        {_id: ObjectID(id)},
        { $set: update_values},
        fn
    );
}

function deleteUser(params, fn) {
    log.info('called method deleteUser');
    collectionUsers.deleteOne(params, fn)
}

// Recipes
function addRecipe(recipe, fn) {
    log.info('called method addRecipe');
    collectionRecipes.insertOne(recipe, (err, result) => {
        log.debug(`err:${err} ok:${result.result.ok}`);
        fn(err, result.ops[0]);
    });
}

function getRecipeById(id, fn) {
    log.info('called method getRecipeById');
    collectionRecipes.findOne(
        ObjectID(id),
        fn
    );
}

function getRecipes(params, fn) {
    log.info('called method getRecipes');
    collectionRecipes.find(params).toArray(fn);
}

function updateRecipe(params, update_values, fn) {
    log.info('called method updateUser');
    collectionRecipes.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}

function deleteRecipe(params, fn) {
    log.info('called method deleteRecipe');
    collectionRecipes.deleteOne(params, fn)
}