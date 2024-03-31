const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const cors = require('cors');
const mongoose=require('mongoose');
const path=require('path')
const authRoutes=require('./routes/authRoute');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const helloRouter = require('./routes/helloRouter');
const getRandomCodeforcesProblem=require('./routes/getRandomCodeforcesProblem');
const verifyCodeforcesUser=require('./routes/verifyCodeforcesUser');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');

app.use('/api/hello', helloRouter()); 
// getting random problem from the codeforces
app.use('/api/getRandomCodeforcesProblem',getRandomCodeforcesProblem());
// verifying codeforces user handle by the provided id and index
app.use('/api/verifyCodeforcesUser',verifyCodeforcesUser());
// database connection



const dbURI='mongodb+srv://vkumar1972003:GbZ8N9irh1sZuTqm@cluster0.gc4tfxs.mongodb.net/CODECONNECTdB';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 45000, // 45 seconds
});






app.get('/', (req, res) => {
  res.sendFile(__dirname+"/public/loginSignup.html");
});
app.use(authRoutes);

app.get('/signup', (req, res) => {
  res.sendFile(__dirname+"/public/codeforcesVerification.html");
});
//app.get('/',(req,res) => res.sendFile('./public/codeforcesVerification'));
app.get('/smoothies',(req,res) =>res.render('smoothies'));


// Apply CORS middleware to your Express app
app.use(cors());
const io = new socket.Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  },
});

// Object to store active lobbies
const lobbies ={};

// Function to generate a random lobby ID
function generateLobbyId() {
  return Math.random().toString(36).substring(2, 9);
}


io.on('connection', (socket) => {

  socket.on('createLobby', (userId, callback) => {
      const lobbyId = generateLobbyId();
      lobbies[lobbyId] = { lobbyId: lobbyId, usersId: [userId],sockets: [socket.id] };
      socket.join(lobbyId);
  
      callback({ lobbyId: lobbyId });
  });
  socket.on('joinLobby', ({ lobbyId, userId }) => {
    if (lobbies[lobbyId]) {
        socket.join(lobbyId);
        lobbies[lobbyId].usersId.push(userId); // Assuming you have a structure to store users in the lobby
        lobbies[lobbyId].sockets.push(socket.id);
    } else {
        // Optionally, you can send an error message to the user joining the lobby
        socket.emit('joinLobbyError', { message: `Lobby ${lobbyId} does not exist` });
    }
  });

  socket.on('userinfo', (lobbyId, callback) => {
    if (lobbies[lobbyId]) {
        const userIds = lobbies[lobbyId].usersId;
        callback({ userIds });
    } else {
        callback({ error: `Lobby ${lobbyId} does not exist` });
    }
});

  socket.on('send_info', ({ userId, lobbyId, info }) => {
    // Assuming you have a structure to store info in the lobby
    if (lobbies[lobbyId]) {
        const infoData = {
            userId: userId,
            info: info,
        };

        if (!lobbies[lobbyId].infoData) {
            lobbies[lobbyId].infoData = [];
        }

        lobbies[lobbyId].infoData.push(infoData);

        // Emit the info data to all users in the lobby
        io.to(lobbyId).emit('receive_info', infoData);
    }
  });


  socket.on('disconnect', () => {
    for (const lobbyId in lobbies) {
        const index = lobbies[lobbyId].sockets.indexOf(socket.id);
        if (index !== -1) {
            lobbies[lobbyId].sockets.splice(index, 1);
            console.log(`User disconnected from lobby ${lobbyId}`);
        }
    }
    console.log(`User ${socket.userId} disconnected`);
  });


  
});

module.exports = server;
