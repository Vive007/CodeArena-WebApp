// ./models/Message.js
const mongoose = require('mongoose');
const moment = require('moment');

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true
  },
  room: {
    type: String, // Room name
    required: true,
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
