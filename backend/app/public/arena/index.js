let roomId;

function createRoom() {
    roomId = document.getElementById('roomId').value;

    // Create a room in the app
    app.ref('rooms/' + roomId).set({
        users: []
    });

    console.log('Room created with ID:', roomId);
}

function joinRoom() {
    const joinRoomId = document.getElementById('joinRoomId').value;

    // Check if the room exists
    app.ref('rooms/' + joinRoomId).once('value', function(snapshot) {
        if (snapshot.exists()) {
            roomId = joinRoomId;
            console.log('Joined room with ID:', roomId);

            // Add the user to the room
            app.ref('rooms/' + roomId + '/users').push().set({
                username: 'User' + Math.floor(Math.random() * 1000) // Assign a random username
            });

            // Update the UI to show the users in the room
            updateRoomUI();
        } else {
            console.log('Room does not exist');
        }
    });
}

function updateRoomUI() {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear the previous list

    // Fetch users from the app and display them in the UI
    app.ref('rooms/' + roomId + '/users').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const user = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = user.username;
            userList.appendChild(li);
        });
    });
}
