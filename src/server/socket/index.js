import Server from 'socket.io';
import log from 'server/log';
import gameService from 'server/services/game';
import authService from 'server/services/authentication';

const DEFAULT_CONFIG = {
    port: 8090
};

// TODO: Something more similar to Sails
// (ie: use express routes, and have both regular requests and websockets working)
function handleAction(socket, action) {
    log.info({action: action}, 'Handled action');

    switch (action.type) {
    case 'LOGIN':
        return authService.login(action.username, action.password);
    case 'LOGOUT':
        return authService.logout(action.token);
    case 'REGISTER':
        return authService.register(action.user);

    case 'JOIN_ROOM':
        return joinRoom(socket, action.id);
    case 'LEAVE_ROOM':
        return leaveRoom(socket, action.id);

    case 'JOIN_GAME':
        return authService.getUserFromToken(action.token)
            .then(player => gameService.joinGame(player.id, action.id, action.password));
    case 'CREATE_GAME':
        return authService.getUserFromToken(action.token)
            .then(player => gameService.createGame(player.id, action.game))
            .then(game => {
                gameService.getCurrentGames()
                    .then(games => broadCastToRoom(socket.server, 'lobby', {
                        type: 'UPDATE_GAMES',
                        games
                    }));

                return game;
            });
    case 'GET_GAME':
        return gameService.getGame(action.id);
    case 'UPDATE_GAMES':
        return gameService.getCurrentGames(action);
    default:
        return Promise.reject('Unhandled action: ' + action.type);
    }
}

function joinRoom(socket, roomId) {
    socket.join(roomId);
    return Promise.resolve(roomId);
}

function leaveRoom(socket, roomId) {
    socket.leave(roomId);
    return Promise.resolve(roomId);
}

function broadCastToRoom(io, roomId, action) {
    io.sockets.in(roomId).emit('action', action);
}

export default function startSocket(config = DEFAULT_CONFIG) {
    const io = new Server().attach(config.port);

    io.on('connection', socket => {
        socket.on('action', (action, sendBack) => {
            sendBack = sendBack || (() => null);

            handleAction(socket, action)
                .then((result) => sendBack(result),
                      (error) => sendBack({errors: [error]}));
        });
    });

    return io;
}
