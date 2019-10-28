const Role = require('./_helpers/role');
const config = require('config.json');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
const db = require('db');

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: '1', username: 'admin', password: 'admin', email: 'admin@email.ru', firstName: 'Admin', lastName: 'User', role: Role.Admin,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTU3MjE5Njg1NX0.zq7r0POc9xT4fr8Ui7JOfOuDlps7H5MlVQxIZ7qK7io'},
    { id: '2', username: 'user', password: 'user', email: 'user@email.ru', firstName: 'Normal', lastName: 'User', role: Role.User,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJwYXNzd29yZCI6InVzZXIiLCJpYXQiOjE1NzIxOTY4NTV9.mleCXRydrbPKkhuX4xICkuRCnRHcz6QONFp-UluA2Io'}
];

module.exports = {
    authenticate,
    registration,
    getAllOrById,
    myProfile
};

function authenticate(request, response, next) {
    const body = request.body;

    if (!body.email ||
        !body.password)
        return next('invalid json');

    const params = {
        email: body.email,
        password: body.password
    };

    db.getUser(params, (err, doc) => {
        if (err)
            return next(err);
        if (!doc)
            return next('not found');

        response.json({ token: doc.token });
    });
}

function registration(request, response, next) {
    const body = request.body;
    const token = jwt.sign({
            username: body.username,
            password: body.password
        }, config.secret);

    const params1 = {
        username: body.username
    };
    const params2 = {
        email: body.email
    };
    const user = {
        username: body.username,
        password: body.password,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: Role.User,
        token: token
    };

    if(!body.username ||
        !body.password ||
        !body.email ||
        !body.firstName ||
        !body.lastName)
        return next('invalid json');

    db.getUser(params1, (err, result) => {
        if(err) return next(err);
        if (result) return next('Username is exits');

        db.getUser(params2, (err, result) => {
            if(err) return next(err);
            if (result) return next('Email is exits');

            db.addUser(user, (err, result) => {
                if(err) return next(err);

                response.json({ token: token });
            });
        });
    });
}

function getAllOrById(request, response, next) {
    if (request.body.id === undefined)
        return getAll(request, response, next);

    getById(request, response, next)
}

function getAll(request, response, next) {
    const token = request.body.token;
    const params = {
        'token': token
    };

    db.getUser(params, (err, doc) => {
        if(err) return next(err);
        if(!doc) return next('invalid token');

        if(doc.role === Role.Admin) {
            db.getUsers({}, (err, results) => {
                if(err) return next(err);

                return response.json(results);
            });
        }
        else
            return next('forbidden');
    });
}

function getById(request, response, next) {
    const token = request.body.token;
    const id = request.body.id;

    const params = {
        'token': token
    };

    db.getUser(params, (err, doc) => {
        if(err)
            return next(err);

        if(!doc)
            return next('invalid token');

        if(doc.role === Role.Admin) {

            db.getUserById(id, (err, doc) => {
                if (err) return next(err);

                return response.json(doc);
            });
        }
        else
            return next('forbidden');
    });
}

function myProfile(request, response, next) {
    const body = request.body;
    const token = body.token;
    const params = {
        token: token
    };

    if (!token)
        return next('invalid json');

    db.getUser(params, (err, doc) => {
        if (err) return next(err);
        if (!doc) return next('not found');

        response.json(doc);
    });
}