import log from 'server/log';
import socketService from 'server/services/socket';
import gameService from 'server/services/game';
import gameplayService from 'server/services/gameplay';
import authService from 'server/services/authentication';
import realtimeHandler from 'server/services/realtimeHandler';

function start() {
    socketService.on('connection', handleNewClient);
}

function handleAction(socket, action) {
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
        return authService.register(action.user)
            .then(result => {
                authService.associateWithSocket(result.player.id, socket.id);
                return result;
            });
    case 'ASSOCIATE_PLAYER_TO_SOCKET':
        return authService.associateWithSocket(action.playerId, action.socketId);

    case 'JOIN_ROOM':
        return socketService.joinRoom(socket, action.id);
    case 'LEAVE_ROOM':
        return socketService.leaveRoom(socket, action.id);

    case 'JOIN_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameService.joinGame(player.id, action.id, action.password));
    case 'CREATE_GAME':
        return authService.getPlayerFromToken(action.token)
            .then(player => gameService.createGame(player.id, action.game))
            .then(gameId => {
                realtimeHandler.startGameRealtimeUpdate(gameId);
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
    case 'TOGGLE_AI':
        // TODO: check rights :)
        return gameplayService.toggleAI(action.playerId, action.gameId, action.enable);

    default:
        return Promise.reject('Unhandled action: ' + action.type);
    }
}

function handleNewClient(socket) {
    socket.on('action', (action, sendBack) => {
        sendBack = sendBack || (() => null);

        handleAction(socket, action)
            .then(result => {
                log.info({action: action}, 'OK');
                // log.info({result: result});
                return result;
            })
            .then((result) => sendBack(result),
                  (error) => sendBack({error: error}));
    });
    socket.on('disconnect', () => authService.dissociateFromSocket(socket.id));
}

export default {
    start
};