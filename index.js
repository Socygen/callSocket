const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const socketIdToUserId = new Map();

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('candidate', (data) => {
        socket.broadcast.emit('candidate', data);
    });

    socket.on('user_online', ({ userId }) => {
        socketIdToUserId.set(socket.id, userId);
        console.log(`User ${userId} is online`);
    });

    socket.on('disconnect', () => {
        const userId = socketIdToUserId.get(socket.id);
        socketIdToUserId.delete(socket.id);
        console.log(`User ${userId} disconnected`);
    });
});

const PORT = 10004;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
