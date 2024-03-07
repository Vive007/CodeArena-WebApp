# CODE-CONNECT-
Real Time Chat Application
This application built using Node.js, Express, Socket.io, Mongoose, RESTful Web Service.

s2

Features
Uses Express as the application Framework.
Real-time communication between a client and a server using Socket.io.
Uses MongoDB, Mongoose for storing messages and querying data.
Uses RESTful Web Service for serve different platforms
Installation
Running Locally
Make sure you have Node.js and npm install.

Clone or Download the repository

git clone https://github.com/batuhaniskr/real-time-chat-application.git
$ cd Real-Time-Chat-Application
Install Dependencies

npm install
MongoDB start for need

mongod
command from a different terminal.
Start the Application

node app.js
Application runs from localhost:3000.

How It Works
A database called "chat_db" named is created via code. The nickname, msg, group information is also kept in the table named Messages.

User to user, As a publication broadcast or group in the room messaging. User to user messaging:

 /w username messagetext
the message is sent as.
Sockets
Having an active connection opened between the client and the server so client can send and receive data. This allows real-time communication using TCP sockets. This is made possible by Socket.io.

The client starts by connecting to the server through a socket(maybe also assigned to a specific namespace). Once connections is successful, client and server can emit and listen to events.

RESTful
Using HTTP requests, we can use the respective action to trigger every of these four CRUD operations.
POST is used to send data to a server — Create
GET is used to fetch data from a server — Read
PUT is used to send and update data — Update
DELETE is used to delete data — Delete
