const express = require('express');
const bodyParser = require('body-parser');
const users_router = require('./users/users.router');
const recipes_router = require('./recipes/recipes.router');
const ingredients_router = require('./ingredients/ingredients.router');
const lang_router = require('./lang/lang.router');
const errors = require('./_helpers/errors');
const log = require('./_helpers/logger');
const db = require('./db');

const app = express();
log.setLevel('info');
if (process.env.NODE_ENV === 'development')
   log.setLevel('debug');

// use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use routes
app.use((req, res, next) => {log.info(req.method + ': ' + req.originalUrl); next()});
app.use('/users', users_router);
app.use('/recipes', recipes_router);
app.use('/ingredients', ingredients_router);
app.use('/lang', lang_router);
app.use(errors);

// connect db and start api
db.connect(() => {
   app.listen(process.env.PORT || 4000, function () {
      log.info('API is working')
   });
   process.on("SIGINT", () => {
      db.close();
      process.exit();
   });
});