const jwt = require('jsonwebtoken');
const Role = require('./_helpers/role');
const crypt = require('_helpers/crypt');
const config = require('config.json');
const db = require('db');
const log = require('_helpers/logger');

module.exports = {
    authenticate,
    registration,
    myProfile,
    update,
    getById,
};

function authenticate(request, response, next) {
    log.info('users.controller: called authenticate method');

    const body = request.body;
    const params = {
        email: body.email
    };

    if (!body.email ||
        !body.password)
        return next('invalid json');

    db.getUser(params, (err, doc) => {
        if (err) return next(err);
        if (!doc) return next('email invalid');

        crypt.compare(body.password, doc.password, function(err, res) {
            if(!res) return next('password invalid');
            response.json({ token: doc.token });
        });
    });
}

function registration(request, response, next) {
    log.info('users.controller: called registration method');

    const body = request.body;
    const params = {
        $or: [{username: body.username}, {email: body.email}]
    };
    const user = {
        username: body.username,
        firstName: '',
        lastName: '',
        password: '',
        email: body.email,
        role: Role.User,
        favourites: [],
        recipes: [],
        token: ''
    };

    if (body.firstName) user.firstName = body.firstName;
    if (body.lastName) user.lastName = body.lastName;
    if (!body.username ||
        !body.password ||
        !body.email)
        return next('invalid json');

    db.getUser(params, (err, result) => {
        if (err) return next(err);
        if (result) return next('username or email is exist');

        crypt.crypt(body.password, function (err, hash) {
            if (err) return next(err);

            const token = jwt.sign(
                {
                    email: body.email,
                    username: body.username,
                    password: hash
                },
                config.secret);

            user.password = hash;
            user.token = token;

            db.addUser(user, err => {
                if (err) return next(err);
                response.json({token: token});
            });
        });
    });
}

function myProfile(request, response, next) {
    log.info('users.controller: called myProfile method');

    const body = request.body;
    const token = body.token;
    const params = {
        token: token
    };

    if (!token) return next('invalid json');

    db.getUser(params, (err, doc) => {
        if (err) return next(err);
        if (!doc) return next('not found');

        const user = doc;
        delete user.token;
        delete user.password;

        response.json(user);
    });
}

function update(request, response, next) {
    log.info('users.controller: called update method');

    const body = request.body;
    const params = {
        token: body.token
    };
    const update_values = {};

    if(!body.token) return next('invalid json');
    if(body.firstName) update_values.firstName = body.firstName;
    if(body.lastName) update_values.lastName = body.lastName;
    if(body.favourites) update_values.favourites = body.favourites;

    if(body.password) {
        crypt.crypt(body.password, function(err, hash) {
            if(err) return next(err);
            update_values.password = hash;

            db.updateUser(params, update_values, (err, result) => {
                if(err) return next(err);
                response.json({ ok: result.ok });
            })
        });
    }
    else {
        db.updateUser(params, update_values, (err, result) => {
            if (err) return next(err);
            response.json({ok: result.ok});
        })
    }
}

function getById(request, response, next) {
    log.info('users.controller: called getById method');

    const id = request.body.id;

    if(!id) return next('invalid json');

    db.getUserById(id, (err, doc) => {
        if (err) return next(err);
        if (!doc) return next('not found');

        const user = doc;
        delete user.password;
        delete user.email;
        delete user.role;
        delete user.favourites;
        delete user.token;

        return response.json(user);
    });
}