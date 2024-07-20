const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO to allow CORS
const io = new Server(server, {
  path: '/chat_socket/socket.io',
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST"] // Allow these HTTP methods
}});

io.on('connection', (socket) => {
  // assign random name to socket
  socket.username = Math.random().toString(36).substring(7);
  console.log('a user connected', socket.username);
  // event listeners
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', socket.username, msg);
  });
  // send message directly to this socket it's randomly generated generated username
  socket.emit('username', socket.username);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

