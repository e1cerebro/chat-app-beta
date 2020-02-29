const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')
const {
    getUsersInRoom,
    getUser,
    removeUser,
    addUser
} = require('../src/utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {generateMessage, generateLocationMessage} = require("../src/utils/messages")

let message = 'Welcome to my chat app.';

io.on('connection', socket => {
    console.log('new web socket connection');

    socket.emit('message', generateMessage(message))
  
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room})
        
        if(error)  return callback(error)

        socket.join(user.room) //joins a room provided by the user
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    });

    socket.on('sendMessage', (message, acknowledgementCallback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return acknowledgementCallback('profanity not allowed!')
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage( user.username,message));
        acknowledgementCallback('Message Delivered!');
    });

    socket.on('sharelocation', (coords, acknowledgementCallback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage( user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        acknowledgementCallback('Location shared.')
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });

});

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log(`Listening at port ${port}`);

});