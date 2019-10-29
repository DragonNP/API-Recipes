require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const user_router = require('users/users.router');
const errors = require('_helpers/errors');
const db = require('db');

db.connect();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', user_router);
app.use(errors);

app.listen(process.env.PORT || 4000, function () {
   console.log('api is working on localhost:4000')
});

process.on("SIGINT", () => {
   db.close();
   process.exit();
});