const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());

module.exports = app;
