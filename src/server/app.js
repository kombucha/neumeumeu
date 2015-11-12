import Server from 'socket.io';

const io = new Server().attach(8090);

io.on('connection', socket => {
    socket.on('action', ({socketId, action}) => console.log(socketId, action));
});
