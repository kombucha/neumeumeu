import Server from 'socket.io';
import * as gameService from 'server/services/game';

const DEFAULT_CONFIG = {
    port: 8090
};

function handleAction(socket, action) {
    switch (action.type) {
    case 'CREATE_GAME':
        return gameService.createGame(action.game);
    case 'UPDATE_GAMES':
        return gameService.getCurrentGames(action)
            .then((games) => emitAction(socket, {
                ...action,
                games,
                meta: undefined
            }));
    }
}

export function emitAction(socket, action) {
    return socket.emit('action', action);
}

export default function startSocket(config = DEFAULT_CONFIG) {
    const io = new Server().attach(config.port);

    io.on('connection', socket => {
        socket.on('action', action => handleAction(socket, action));
    });

    return io;
}
