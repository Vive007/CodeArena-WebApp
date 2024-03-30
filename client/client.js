const socket = io('http://localhost:3000');


function updateUserList(lobbyId) {
  // Emit 'userinfo' event to retrieve the user list for the lobby
  socket.emit('userinfo', lobbyId, (response) => {
    if (response.userIds) {
      const userList = response.userIds.join(', ');
      console.log(`Users in lobby ${lobbyId}: ${userList}`);
      // You can display the user list in the UI or perform other actions here
    } else if (response.error) {
      console.error(response.error);
    }
  });
}
// Function to create a lobby
function createLobby() {
  const userId = document.getElementById('userId').value.trim();

  if (userId) {
    socket.emit('createLobby', userId, (response) => {
      const lobbyId = response.lobbyId;
      updateUserList(lobbyId);
      document.getElementById('lobbyStatus').innerText = `Lobby created with ID: ${lobbyId}`;
    });
  } else {
    alert('Please enter a valid User ID.');
  }
}

// Function to join a lobby
function joinLobby() {
  const userId = document.getElementById('userId').value.trim();
  const lobbyId = document.getElementById('lobbyId').value.trim();

  if (userId && lobbyId) {
    socket.emit('joinLobby', { lobbyId, userId });
    updateUserList(userId);
  } else {
    alert('Please enter both User ID and Lobby ID.');
  }
}

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
