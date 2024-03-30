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
const rooms = {};

// Function to generate a random lobby ID
function generateLobbyId() {
  return Math.random().toString(36).substring(2, 9);
}


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Handle room creation
    socket.on('createRoom', (roomName) => {
      if (!rooms[roomName]) {
        rooms[roomName] = { name: roomName, users: {} }; // Create room object
        socket.join(roomName); // Join the created room
        io.emit('roomCreated', roomName); // Broadcast room creation to all clients
      } else {
        socket.emit('roomExists', roomName); // Inform client if room already exists
      }
    });
  
    // Handle room joining
    socket.on('joinRoom', (roomName) => {
      if (rooms[roomName]) {
        socket.join(roomName); // Join the specified room
        rooms[roomName].users[socket.id] = username; // Add user to room's user list (assuming username is defined elsewhere)
        io.to(roomName).emit('userJoined', username); // Broadcast user join to room members
      } else {
        socket.emit('roomNotFound', roomName); // Inform client if room doesn't exist
      }
    });
  
    // Handle chat messages
    socket.on('chatMessage', (message, roomName) => {
      if (rooms[roomName]) {
        io.to(roomName).emit('message', { username, message }); // Broadcast message to room members
      } else {
        socket.emit('roomNotFound', roomName); // Inform client if room doesn't exist (redundant check, but can be kept for clarity)
      }
    });
  
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  
      // Remove user from rooms and update room user list
      for (const roomName in rooms) {
        if (rooms[roomName].users[socket.id]) {
          delete rooms[roomName].users[socket.id];
          io.to(roomName).emit('userLeft', username); // Broadcast user leave to room members
        }
      }
    });
  });

module.exports = server;
