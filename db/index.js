const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

const uri = "mongodb+srv://Recipes-API-User:58pP2X0Lm8RjWxrR@cluster0-sooyn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;
let collectionUser;

module.exports = {
    init,
    close,
    addUser,
    getUser,
    getUsers,
    getUserById,
    updateUser,
    updateUserById
};

function init() {
    mongoClient.connect(function (err, client) {
        if (err) return console.log(err);

        const database = client.db('apidb');
        const collection = database.collection('users');

        dbClient = client;
        collectionUser = collection;
    })
}

function close() {
    dbCient.close();
}

function addUser(user, fn) {
    collectionUser.insertOne(user, function (err, result) {
        fn(err, result.ops[0]);
    });
}

function getUser(params, fn) {
    collectionUser.findOne(params, function(err, doc) {
        fn(err, doc);
    });
}

function getUserById(id, fn) {
    collectionUser.findOne(
        ObjectID(id),
        function(err, doc) {
        fn(err, doc);
    });
}

function getUsers(params, fn) {
    collectionUser.find(params).toArray(function (err, results) {
        fn(err, results);
    });
}

function updateUser(params, update_values,fn) {
    collectionUser.findOneAndUpdate(
        params,
        { $set: update_values},
        fn
    );
}

function updateUserById(id, update_values,fn) {
    collectionUser.findOneAndUpdate(
        {_id: ObjectID(id)},
        { $set: update_values},
        fn
    );
}