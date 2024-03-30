// script.js
const socket = io('http://localhost:3000');
const username = prompt('Enter your username: '); // Assuming username input
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');
const roomList = document.getElementById('room-list');

// Function to display chat messages
function addMessage(message, isSelf) {
  const messageElement = document.createElement('li');
  messageElement.classList.add(isSelf ? 'self' : 'other'); // Add CSS classes for styling (optional)
  messageElement.innerText = `${username} (in ${currentRoom}): ${message}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // Scroll to bottom after adding message
}

// Function to handle room creation response from server
socket.on('roomCreated', (roomName) => {
  console.log(`Room ${roomName} created!`);
  updateRoomList(); // Update room list after creation
  joinRoom(roomName); // Join the newly created room
});

// Function to handle room existence response from server
socket.on('roomExists', (roomName) => {
  console.log(`Room ${roomName} already exists.`);
});

// Function to handle room not found response from server
socket.on('roomNotFound', (roomName) => {
  console.log(`Room ${roomName} not found.`);
  alert(`Room ${roomName} does not exist.`); // Alert the user
});

// Function to update room list
function updateRoomList() {
  roomList.innerHTML = ''; // Clear existing list

  for (const roomName in rooms) { // Assuming 'rooms' is defined server-side to hold room data
    const roomElement = document.createElement('li');
    roomElement.innerText = roomName;
    roomElement.addEventListener('click', () => {
      joinRoom(roomName);
    });
    roomList.appendChild(roomElement);
  }
}

let currentRoom = null; // Variable to store the current room the user is in

// Function to handle room joining response from server
socket.on('userJoined', (username) => {
  console.log(`${username} joined the room.`);
  addMessage(`${username} has joined the room.`, false); // Display join message
});

// Function to handle user leaving response from server
socket.on('userLeft', (username) => {
  console.log(`${username} left the room.`);
  addMessage(`${username} has left the room.`, false); // Display leave message
});

// Function to handle chat messages from server
socket.on('message', (data) => {
  addMessage(data.message, data.username === username); // Check if message is from the user itself
});

// Function to join a room
function joinRoom(roomName) {
  socket.emit('joinRoom', roomName);
  currentRoom = roomName; // Update current room
  messages.innerHTML = ''; // Clear messages when joining a new room
}

// Handle sending chat messages
sendMessageButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message && currentRoom) {
    socket.emit('chatMessage', message, currentRoom);
    messageInput.value = ''; // Clear message input after sending
    addMessage(message, true); // Display own message
  }
});
