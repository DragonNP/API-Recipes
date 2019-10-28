const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;
let collectionUser;

module.exports = {
    init,
    close,
    addUser,
    getUser,
    getUsers,
    getUserById
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
    collectionUser.findOne(ObjectID(id), function(err, doc) {
        fn(err, doc);
    });
}

function getUsers(params, fn) {
    collectionUser.find(params).toArray(function (err, results) {
        fn(err, results);
    });
}
