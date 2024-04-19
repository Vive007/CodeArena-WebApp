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
const axios = require('axios');

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


// Array to store challenge data
let challenges = [];

// Endpoint to store challenge data
app.post('/api/storeChallengeData', (req, res) => {
  const { userId, opponentName, problemId, index } = req.body;

  // Add challenge data to the array
  challenges.push({
    userId: userId,
    opponentName: opponentName,
    problemId: problemId,
    index: index,
    timestamp: Date.now() // Store current timestamp
  });

  console.log(challenges);

  // Send response
  res.status(200).json({ message: 'Challenge data stored successfully' });
});

// Function to remove expired challenges
function removeExpiredChallenges() {
  const now = Date.now();
  challenges = challenges.filter(challenge => now - challenge.timestamp <= 5 * 60 * 1000);
}

// Set interval to remove expired challenges every minute
setInterval(removeExpiredChallenges, 60 * 1000);

// Endpoint to check and start challenge
app.post('/api/checkAndStartChallenge', async (req, res) => {
  const { userId, problemId, index } = req.body;

  const existingIndex = challenges.findIndex(challenge => {
    // Convert challenge.problemId to a number for comparison
    const challengeProblemId = parseInt(challenge.problemId);
    // Convert problemId to a number for comparison
    const numericProblemId = parseInt(problemId);

    const isOpponentNameMatch = challenge.opponentName === userId;
    const isProblemIdMatch = challengeProblemId === numericProblemId;
    const isIndexMatch = challenge.index === index;
    console.log(isOpponentNameMatch && isProblemIdMatch && isIndexMatch);
    return isOpponentNameMatch && isProblemIdMatch && isIndexMatch;
  });

  if (existingIndex !== -1) {
    // If the combination exists, remove it from the array
    const removedChallenge = challenges.splice(existingIndex, 1)[0];

    // Send the removed challenge data to the new API endpoint startchallenge
    const userId=removedChallenge.userId;
    const problemId=removedChallenge.problemId;
    const index=removedChallenge.index;
    const opponentName=removedChallenge.opponentName; // Assuming opponentName is also needed

    try {
      const response = await axios.post('http://localhost:3000/api/checkSubmissionStatus', {
        problemId,
        index,
        userId,
        opponentName // assuming opponentName is defined somewhere in the scope
      });

      if (response.status === 200) {
        // Get the winner from the response
        const { winner } = response.data;
        if (winner) {
          // If there's a winner, announce them in the room using Socket.IO
          io.emit('winnerAnnouncement', { winner });
          console.log(winner);
          return res.status(200).json({ message: `Winner announced: ${winner}` });
          // console.log(winner);
        }
      }

      // If no winner within 30 seconds, announce in the room
      io.emit('winnerAnnouncement', { winner: 'No winner within 30 seconds' });
      return res.status(200).json({ message: 'No winner within 30 seconds' });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});



async function myCallback(id, index, userId) {
  try {
      const response = await axios.get('https://codeforces.com/api/user.status', {
          params: { handle: userId, from: 1, count: 1 },
      });
  
      const submittedId = response.data.result[0]['contestId'];
      const submittedIndex = response.data.result[0]['problem']['index'];
      const verdict = response.data.result[0]['verdict'];
      
      if (submittedId == id && submittedIndex == index && verdict == "OK") {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error('Failed to fetch data from Codeforces API:', error.message);
      return false;
  }
}

const verify = async (id, index, userId) => {
  return new Promise(async (resolve, reject) => {
      let verified = false;
      let intervalID;
      intervalID = setInterval(async () => {
          verified = await myCallback(id, index, userId);
          if (verified) {
              clearInterval(intervalID);
              clearTimeout(timeoutID);
              resolve(true);
          }
      }, 3000);

      const timeoutID = setTimeout(() => {
          clearInterval(intervalID);
          resolve(false);
      }, 60000);
  });
};

// Endpoint to check submission status
app.post('/api/checkSubmissionStatus', async (req, res) => {
  const { problemId, index, userId, opponentName } = req.body;

  try {
      // Verify submission for both users
      const userSubmission = verify(problemId, index, userId);
      const opponentSubmission = verify(problemId, index, opponentName);

      // Wait for both submissions to be verified
      console.log("before");
      const [userVerified, opponentVerified] = await Promise.all([userSubmission, opponentSubmission]);
      console.log("after");
      // Determine the winner based on who submits first
      let winner;
      if (userVerified && !opponentVerified) {
          winner = userId;
      } else if (!userVerified && opponentVerified) {
          winner = opponentName;
      } else {
          winner = null; // No winner within the specified time
      }
      console.log(winner);
      res.status(200).json({ winner });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = server;
