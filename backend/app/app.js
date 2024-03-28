const express = require('express');
const app = express();
const helloRouter = require('./routes/helloRouter');

const getRandomCodeforcesProblem=require('./routes/getRandomCodeforcesProblem');
const verifyCodeforcesUser=require('./routes/verifyCodeforcesUser');

app.use('/api/hello', helloRouter()); 

// getting random problem from the codeforces
app.use('/api/getRandomCodeforcesProblem',getRandomCodeforcesProblem());

// verifying codeforces user handle by the provided id and index
app.use('/api/verifyCodeforcesUser',verifyCodeforcesUser());


module.exports = app;
