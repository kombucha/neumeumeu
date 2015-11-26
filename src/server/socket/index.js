import Server from 'socket.io';
import log from 'server/log';
import gameService from 'server/services/game';
import authService from 'server/services/authentication';

const DEFAULT_CONFIG = {
    port: 8090
};

// TODO: something more similar to Sails
// (ie: use express routes, and have both regular requests and websockets working)
function handleAction(socket, action) {
    log.info({action: action}, 'Handled action');
    switch (action.type) {
    case 'LOGIN':
        return authService.login(action.username, action.password);
    case 'REGISTER':
        return authService.register(action.user);
    case 'CREATE_GAME':
        return gameService.createGame(action.game);
    case 'UPDATE_GAMES':
        return gameService.getCurrentGames(action);
    default:
        return Promise.reject('Unhandled action: ' + action.type);
    }
}

export function emitAction(socket, action) {
    return socket.emit('action', action);
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
