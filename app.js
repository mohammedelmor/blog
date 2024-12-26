const express = require('express');
const logger = require('morgan');

const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

app.use(logger('dev'));
app.use(express.json());

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/posts", postsRouter)

module.exports = app;
