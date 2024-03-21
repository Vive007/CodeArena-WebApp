const express = require('express');
const app = express();
const helloRouter = require('./routes/helloRouter');

app.use('/api/hello', helloRouter()); 

module.exports = app;
