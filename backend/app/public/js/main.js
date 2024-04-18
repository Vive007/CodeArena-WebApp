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

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

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