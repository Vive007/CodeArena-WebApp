const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const Message = require('./models/Message');
const cors = require('cors');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const path=require('path')
const {requireAuth, checkUser}=require('./Middleware/authMiddleware');
const moment = require('moment');
 require('dotenv').config();
const authRoutes=require('./routes/authRoute');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//check here if not work

//const io = socket(server);
const io = new socket.Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  },
});


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



const dbURI=process.env.dbURI;
mongoose.connect(dbURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
  // You are connected to the database, you can start defining schemas and models here
});
Message.deleteMany({});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

app.get('/*',checkUser);
app.get('/chat',requireAuth, (req, res) => {
  res.render('start');
});

app.get('/home',requireAuth, (req, res) => {
  // 
  res.render('coderHome');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/public/loginSignup.html");
});





app.use(authRoutes);

// implementing chat message handler

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('chatMessage', async (msgData) => {
    try {
      console.log(msgData);
      const formattedTime = moment().format('h:mm a');
      const user = getCurrentUser(socket.id); 
      // Store the message in MongoDB
      const message = new Message({
        username: msgData.username,
        text: msgData.text,
        time: formattedTime,
        room: user.room
        // Additional fields if needed
      });
      await message.save();
    //  await  Message.deleteMany({});

      // Broadcast the message to all clients including the sender
     //io.emit('message', message);
     io.to(user.room).emit('message', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

// Route to fetch chat messages
// app.get('/messages', async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ time: -1 }).limit(20); // Assuming 'time' is the field to sort by
//     const formattedMessages = messages.map(message => ({
//       username: message.username,
//       text: message.text,
//       time: message.time,
//       room:message.room
//     }));
//     res.json(formattedMessages);
//   } catch (error) {
//     console.error('Error fetching chat messages:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// new updated one 
app.get('/messages', async (req, res) => {
  try {
    const roomName = req.query.room; // Assuming the room name is passed as a query parameter

    if (!roomName) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const messages = await Message.find({ room: roomName }).sort({ time: -1 }).limit(20); // Filter messages by room name
    const formattedMessages = messages.map(message => ({
      username: message.username,
      text: message.text,
      time: message.time,
      room: message.room
    }));
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





















// set cookies
// app.get('/set-cookies',(req,res)=>
// {
//   res.cookie('newUser',true);
//   res.cookie('isEmployee',true,{maxAge: 1000 *60*60*24});
//   res.send("you got the cookies");
// });
// // read cookies
// app.get('/read-cookies',(req,res)=>
// {
//   const cookies=req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });

// Apply CORS middleware to your Express app
app.use(cors());
// const io = new socket.Server(server, {
//   cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//   },
// });

// // Object to store active lobbies
// const lobbies ={};

// // Function to generate a random lobby ID
// function generateLobbyId() {
//   return Math.random().toString(36).substring(2, 9);
// }


// io.on('connection', (socket) => {

//   socket.on('createLobby', (userId, callback) => {
//       const lobbyId = generateLobbyId();
//       lobbies[lobbyId] = { lobbyId: lobbyId, usersId: [userId],sockets: [socket.id] };
//       socket.join(lobbyId);
  
//       callback({ lobbyId: lobbyId });
//   });
//   socket.on('joinLobby', ({ lobbyId, userId }) => {
//     if (lobbies[lobbyId]) {
//         socket.join(lobbyId);
//         lobbies[lobbyId].usersId.push(userId); // Assuming you have a structure to store users in the lobby
//         lobbies[lobbyId].sockets.push(socket.id);
//     } else {
//         // Optionally, you can send an error message to the user joining the lobby
//         socket.emit('joinLobbyError', { message: `Lobby ${lobbyId} does not exist` });
//     }
//   });

//   socket.on('userinfo', (lobbyId, callback) => {
//     if (lobbies[lobbyId]) {
//         const userIds = lobbies[lobbyId].usersId;
//         callback({ userIds });
//     } else {
//         callback({ error: `Lobby ${lobbyId} does not exist` });
//     }
// });

//   socket.on('send_info', ({ userId, lobbyId, info }) => {
//     // Assuming you have a structure to store info in the lobby
//     if (lobbies[lobbyId]) {
//         const infoData = {
//             userId: userId,
//             info: info,
//         };

//         if (!lobbies[lobbyId].infoData) {
//             lobbies[lobbyId].infoData = [];
//         }

//         lobbies[lobbyId].infoData.push(infoData);

//         // Emit the info data to all users in the lobby
//         io.to(lobbyId).emit('receive_info', infoData);
//     }
//   });


//   socket.on('disconnect', () => {
//     for (const lobbyId in lobbies) {
//         const index = lobbies[lobbyId].sockets.indexOf(socket.id);
//         if (index !== -1) {
//             lobbies[lobbyId].sockets.splice(index, 1);
//             console.log(`User disconnected from lobby ${lobbyId}`);
//         }
//     }
//     console.log(`User ${socket.userId} disconnected`);
//   });


  
// });

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const botName = "ChatCord Bot";


// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    //console.log("bibekk");
    const user = getCurrentUser(socket.id);
    
    //io.to(user.room).emit("message", formatMessage);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

module.exports = server;
