var http = require('http');
var express = require('express');
var logger = require('morgan');
var fs = require('fs');

let { messages } = require('./messages.json');

var app = express();

var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
  //user connects
  console.log('user connected');

  socket.emit('content', messages);

  socket.on('addMessage', (message) => {
    messages.push(message);
    io.emit('content', messages);
  });

  //user disconnects
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// app.use(logger('dev'));

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//listener

server.listen(3000, () => {
  console.log('server is live on port 3000');
});

// function to fetch messages from file

//to watch json file contineusly

fs.watchFile('./messages.json', { interval: 1000 }, (stats) => {
  socket.emit('content', messages);
});
