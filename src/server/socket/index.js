import Server from 'socket.io';
import log from 'server/log';
import gameService from 'server/services/game';
import gameplayService from 'server/services/gameplay';
import authService from 'server/services/authentication';


function handleAction(socket, action) {
    log.info({action: action}, 'Handled action');

    switch (action.type) {
    case 'LOGIN':
        return authService.login(action.username, action.password)
            .then(result => {
                authService.associateWithSocket(result.player.id, socket.id);
                return result;
            });
    case 'LOGOUT':
        return authService.logout(action.token)
            .then(result => {
                authService.dissociateFromSocket(socket.id);
                return result;
            });
    case 'REGISTER':
        return authService.register(action.user);
    case 'ASSOCIATE_PLAYER_TO_SOCKET':
        return authService.associateWithSocket(action.playerId, action.socketId);

    case 'JOIN_ROOM':
        return joinRoom(socket, action.id);
    case 'LEAVE_ROOM':
        return leaveRoom(socket, action.id);

    case 'JOIN_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameService.joinGame(player.id, action.id, action.password));
    case 'CREATE_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameService.createGame(player.id, action.game))
            .then(gameId => {
                startGameRealtimeUpdate(socket.server, gameId);
                return gameId;
            });
    case 'UPDATE_GAMES':
        return gameService.getCurrentGames();

    case 'GET_GAMEPLAY':
    case 'GET_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => {
                return gameplayService.getGameplayForPlayer(player.id, action.id);
            });
    case 'START_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameplayService.startRound(player.id, action.id));
    case 'PLAY_CARD':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameplayService.playCard(player.id, action.gameId, action.cardValue));
    case 'CANCEL_CARD':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameplayService.cancelCard(player.id, action.gameId));
    case 'CHOOSE_PILE':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameplayService.choosePile(player.id, action.gameId, action.pile));

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
    io.sockets.to(roomId).emit('action', action);
}

function startRealtimeLobbyUpdate(io) {
    log.info('STARTING REALTIME UPDATES FOR LOBBY');
    gameService.onLobbyUpdate(games => {
        broadCastToRoom(io, 'lobby', {
            type: 'UPDATE_GAMES',
            games
        });
    });
}

function startGameRealtimeUpdate(io, gameId) {
    log.info('STARTING REALTIME UPDATES FOR GAME', gameId);

    gameplayService.onGameplayUpdate(gameId, game => {
        const interestingSockets = Object.keys(io.sockets.connected)
            .filter(socketId => {
                return io.sockets.connected[socketId].rooms.indexOf(gameId) !== -1;
            });

        Promise.all(interestingSockets.map(authService.getPlayerFromSocket))
            .then(players => {
                players.forEach((player, idx) => {
                    const socketId = interestingSockets[idx];
                    io.sockets.connected[socketId].emit('action', {
                        type: 'UPDATE_CURRENT_GAME',
                        game: gameplayService.transformGameplayForPlayer(player.id, game)
                    });
                });
            });
    });
}

function startRunningGamesRealtimeUpdate(io) {
    return gameService.getCurrentGames()
        .then(games => {
            games.forEach(game => startGameRealtimeUpdate(io, game.id));
        });
}

function handleNewSocket(socket) {
    socket.on('action', (action, sendBack) => {
        sendBack = sendBack || (() => null);

        handleAction(socket, action)
            .then((result) => sendBack(result),
                  (error) => sendBack({error: error}));
    });
    socket.on('disconnect', () => authService.dissociateFromSocket(socket.id));
}

// TODO: On startup
// - Clean up old sockets from db
export default function attachRealtimeServer(server, config) {
    const io = Server(server, config);

    startRealtimeLobbyUpdate(io);
    startRunningGamesRealtimeUpdate(io);

    io.on('connection', handleNewSocket);

    return io;
}
