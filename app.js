const express = require('express');
const logger = require('morgan');

const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());

app.use("/", indexRouter)
app.use("/users", usersRouter)

module.exports = app;
