const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, 'public')));
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'login.html'));
});

app.get('/chat', (req, res) => {
  console.log("User " + req.body.username + " connected")
  res.sendFile(join(__dirname, 'public', 'chat.html'));
});

app.post('/chat', (req, res) => {
  const message = req.body.input;
  const username = req.body.username;
  io.emit('chat message', username + " | " + message);
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});




// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Serve static files from the public directory
// app.use(express.static('public'));

// // Create HTTP server
// const server = http.createServer(app);

// // Create Socket.IO server
// const io = socketIO(server);

// // Handle Socket.IO connections
// io.on('connection', (socket) => {
//   console.log('Client connected');
  
//   // Handle messages from clients
//   socket.on('message', (message) => {
//     console.log('Received: ', message);
//     // Broadcast the message to all clients
//     io.emit('message', message);
//   });

//   // Handle login from clients
//   socket.on('login', (username) => {
//     console.log(`${username} logged in`);
//     // Save username to socket
//     socket.username = username;
//   });

//   // Handle client disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
