const express = require('express');
const mongoose=require('mongoose');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const cors = require('cors');
const path=require('path')

// const helloRouter = require('./routes/helloRouter');
// const getRandomCodeforcesProblem=require('./routes/getRandomCodeforcesProblem');
// const verifyCodeforcesUser=require('./routes/verifyCodeforcesUser');

// app.use('/api/hello', helloRouter()); 
// // getting random problem from the codeforces
// app.use('/api/getRandomCodeforcesProblem',getRandomCodeforcesProblem());
// // verifying codeforces user handle by the provided id and index
// app.use('/api/verifyCodeforcesUser',verifyCodeforcesUser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');



// database connection

// routes
// Define a route to render the HTML page

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/public/loginSignup.html");
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+"/public/codeforcesVerification.html");
});
//app.get('/',(req,res) => res.sendFile('./public/codeforcesVerification'));
app.get('/smoothies',(req,res) =>res.render('smoothies'));

const port = process.env.PORT || '3000'

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});