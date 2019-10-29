const Role = require('./_helpers/role');
const config = require('config.json');
const jwt = require('jsonwebtoken');
const db = require('db');

module.exports = {
    authenticate,
    registration,
    myProfile,
    getAllOrById,
    updateMeOrRoleById
};

function authenticate(request, response, next) {
    const body = request.body;
    const params = {
        email: body.email,
        password: body.password
    };

    if (!body.email ||
        !body.password)
        return next('invalid json');

    db.getUser(params, (err, doc) => {
        if (err)
            return next(err);
        if (!doc)
            return next('email or password invalid');

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
        role: Role.User,
        token: token
    };

    if(body.firstName)
        user.firstName = body.firstName;

    if(body.lastName)
        user.lastName = body.lastName;

    if(!body.username ||
        !body.password ||
        !body.email)
        return next('invalid json');

    db.getUser(params1, (err, result) => {
        if(err) return next(err);
        if (result) return next('Username is exits');

        db.getUser(params2, (err, result) => {
            if(err) return next(err);
            if (result) return next('Email is exits');

            db.addUser(user, (err, result) => {
                if(err) return next(err);

                response.json({ token: result.token });
            });
        });
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


function getAllOrById(request, response, next) {
    if (request.body.id === undefined)
        return getAll(request, response, next);

    getById(request, response, next)
}

function updateMeOrRoleById(request, response, next) {
    if (request.body.id === undefined)
        return updateMe(request, response, next);

    updateRoleById(request, response, next)
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

function updateMe(request, response, next) {
    const body = request.body;
    
    const params = {
        token: body.token
    };
    const update_values = {
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    };

    db.updateUser(params, update_values, (err, result) => {
        if(err) return next(err);
        response.json({
            ok: result.ok
        });
    })
}

function updateRoleById(request, response, next) {
    const body = request.body;

    if(body.role !== Role.Admin &&
        body.role !== Role.User)
        return next('role is invalid');

    const params = {
        token: body.token
    };

    db.getUser(params, (err, doc) => {
        if(err)
            return next(err);

        if(!doc)
            return next('invalid token');

        if(doc.role === Role.Admin) {

            db.updateUserById(body.id, {role: body.role}, (err, result) => {
                if(err) return next(err);
                response.json({ok: result.ok});
            })
        }
        else
            return next('forbidden');
    });
}