const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();
//const Qs = require('qs');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username);


// // Join chatroom
// socket.emit('joinRoom', { username, room });
// Call fetchChatMessages when the page loads
window.addEventListener('load', fetchChatMessages);
// Function to fetch chat messages from the server
async function fetchChatMessages() {
    try {
      const response = await fetch(`/messages?room=${room}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      const messages = await response.json();
      messages.forEach((message) => {
        outputMessage(message);
      });
      // Scroll down
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  }

// Join chatroom
socket.on('connect', () => {
    const { username, room } = Qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    socket.emit('joinRoom', { username, room });
  });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('winnerAnnouncement', ({ winner }) => {
  outputMessage(`Winner is ${winner}`);
});

// Message from server
socket.on('message', async (message) => {
  console.log(message);
  outputMessage(message);

  // Check if the message contains the accept pattern
  const acceptPattern = /^@accept (\d+) ([a-zA-Z]+\d*)$/;
  const match = message.text.match(acceptPattern);

  if (match) {
    // Extract problemId and index from the matched pattern
    const problemId = match[1];
    const index = match[2];

    // Perform further actions with problemId and index
    // For example, you can send this information to the backend
    // or trigger some other functionality
    console.log('Accept command detected:');
    console.log('Problem ID:', problemId);
    console.log('Index:', index);

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:3000/api/checkAndStartChallenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: message.username, problemId, index })
      });

      if (!response.ok) {
        throw new Error('Failed to check and start challenge');
      }

      console.log('Check and start challenge successful');
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error
    }
  }

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});



// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
//   socket.emit('chatMessage', msg);
socket.emit('chatMessage', {username, text: msg });

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location.href = '/chat';
  } else {
  }
});


document.getElementById('challenge-btn-id').addEventListener('click', async function() {
  // Prompt user for opponent's name
  var opponentName = prompt('Enter opponent\'s name:');
  if (opponentName) {
    try {
      const response = await fetch('http://localhost:3000/api/getRandomCodeforcesProblem');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data.link) {
          throw new Error('Some error occurred. Please reload the page');
      }
      
      const { link, problemId, index } = data.link;

      // Do something with the fetched data, like displaying it to the user
      console.log('Problem received:', link, problemId, index);
      // Construct the message
      var msg = `I am challenging ${opponentName} to solve the problem ${link}\n`;
      msg += `To accept the challenge ${opponentName} should type: @accept ${problemId} ${index}`;
      
      socket.emit('chatMessage', msg);


      const challengeData = {
        userId: 'algorithm003', // Replace 'yourUserId' with the actual user ID
        opponentName: opponentName,
        problemId: problemId,
        index: index
      };

      // Send challenge data to the backend
      const backendResponse = await fetch('http://localhost:3000/api/storeChallengeData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(challengeData)
      });

    } catch (error) {
      // Handle errors
      console.error('Error:', error.message);
      // Display an error message to the user, if needed
    }
  }
});
