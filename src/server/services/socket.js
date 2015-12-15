import Server from 'socket.io';

let io;

function init(server, config) {
    io = Server(server, config);
    return io;
}

function on(...args) {
    return io.on.apply(io, args);
}

function emitAction(socketId, action) {
    io.sockets.connected[socketId].emit('action', action);
}

function getRoomSocketsIds(roomId) {
    return Object.keys(io.sockets.connected)
        .filter(socketId => {
            return io.sockets.connected[socketId].rooms.indexOf(roomId) !== -1;
        });
}

function broadcastActionToRoom(roomId, action) {
    io.sockets.to(roomId).emit('action', action);
}

function joinRoom(socket, roomId) {
    socket.join(roomId);
    return Promise.resolve(roomId);
}

function leaveRoom(socket, roomId) {
    socket.leave(roomId);
    return Promise.resolve(roomId);
}

export default {
    init,

    on,
    joinRoom,
    leaveRoom,

    getRoomSocketsIds,
    emitAction,
    broadcastActionToRoom
};
