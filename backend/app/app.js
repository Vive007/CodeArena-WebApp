const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const cors = require('cors');


const helloRouter = require('./routes/helloRouter');
const getRandomCodeforcesProblem=require('./routes/getRandomCodeforcesProblem');
const verifyCodeforcesUser=require('./routes/verifyCodeforcesUser');

app.use('/api/hello', helloRouter()); 
// getting random problem from the codeforces
app.use('/api/getRandomCodeforcesProblem',getRandomCodeforcesProblem());
// verifying codeforces user handle by the provided id and index
app.use('/api/verifyCodeforcesUser',verifyCodeforcesUser());



// Apply CORS middleware to your Express app
app.use(cors());
const io = new socket.Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  },
});

// Object to store active lobbies
const lobbies = {};

// Function to generate a random lobby ID
function generateLobbyId() {
  return Math.random().toString(36).substring(2, 9);
}

io.on('connection', (socket) => {
  socket.on('create_lobby', (userId, callback) => {
      const lobbyId = generateLobbyId();
      lobbies[lobbyId] = {
          users: [{ id: socket.id, userId }]
      };
      callback(lobbyId);
});

socket.on('join_lobby', (lobbyId, userId, callback) => {
  if (lobbies[lobbyId]) {
      // Check if the lobby already has two users
      if (lobbies[lobbyId].users.length >= 2) {
        callback(false, 'Lobby is full');
        return;
      }
      lobbies[lobbyId].users.push({ id: socket.id, userId });
      callback(true);
      // Notify everyone in the lobby about the new user
      io.to(lobbyId).emit('user_joined', { userId });
  } else {
      callback(false);
  }
});


socket.on('update_checkbox', (lobbyId, isChecked) => {
  const lobby = lobbies[lobbyId];
  if (lobby) {
      const user = lobby.users.find(user => user.id === socket.id);
      if (user) {
          user.isChecked = isChecked;
          io.to(lobbyId).emit('checkbox_updated', { userId: user.userId, isChecked });
      }
  }
});

socket.on('disconnect', () => {
  // Find and remove user from all lobbies
  for (const lobbyId in lobbies) {
      const index = lobbies[lobbyId].users.findIndex(user => user.id === socket.id);
      if (index !== -1) {
          const userId = lobbies[lobbyId].users[index].userId;
          lobbies[lobbyId].users.splice(index, 1);
          // Notify other users in the lobby about the disconnection
          io.to(lobbyId).emit('user_left', { userId });
          if (lobbies[lobbyId].users.length === 0) {
              delete lobbies[lobbyId];
          }
          break; // Only need to remove from one lobby
      }
  }
});


});



module.exports = server;
