import log from 'server/log';
import socketService from 'server/services/socket';
import gameService from 'server/services/game';
import gameplayService from 'server/services/gameplay';
import authService from 'server/services/authentication';
import realtimeHandler from 'server/services/realtimeHandler';

function start() {
    socketService.on('connection', handleNewClient);
}

function handleAction(socket, action, player) {
    log.info({action: action});

    switch (action.type) {
    case 'LOGIN':
        socketService.associatePlayerWithSocket(player.id, socket.id);
        return player;
    case 'LOGOUT':
        return authService.logout(action.token)
            .then(result => {
                socketService.dissociatePlayerFromSocket(socket.id);
                return result;
            });
    case 'REGISTER':
        return authService.register(action.user)
            .then(result => {
                socketService.associatePlayerWithSocket(result.player.id, socket.id);
                return result;
            });
    case 'ASSOCIATE_PLAYER_TO_SOCKET':
        return socketService.associatePlayerWithSocket(action.playerId, action.socketId);

    case 'JOIN_ROOM':
        return socketService.joinRoom(socket, action.id);
    case 'LEAVE_ROOM':
        return socketService.leaveRoom(socket, action.id);

    case 'JOIN_GAME':
        return gameService.joinGame(player.id, action.id, action.password)
            .then(game => gameplayService.transformGameplayForPlayer(player.id, game));
    case 'CREATE_GAME':
        return gameService.createGame(player.id, action.game)
            .then(gameId => {
                realtimeHandler.startGameRealtimeUpdate(gameId);
                return gameId;
            });
    case 'UPDATE_GAMES':
        return gameService.getCurrentGames();

    case 'GET_GAME':
        return gameplayService.getGameplayForPlayer(player.id, action.id);
    case 'START_GAME':
        return gameplayService.startRound(player.id, action.id);
    case 'PLAY_CARD':
        return gameplayService.playCard(player.id, action.gameId, action.cardValue);
    case 'CANCEL_CARD':
        return player => gameplayService.cancelCard(player.id, action.gameId);
    case 'CHOOSE_PILE':
        return gameplayService.choosePile(player.id, action.gameId, action.pile);
    case 'PLAYER_READY':
        return gameplayService.playerReady(player.id, action.gameId);

    default:
        return Promise.reject('Unhandled action: ' + action.type);
    }
}

function loadPlayerFromToken(token) {
    return token ? authService.getPlayerFromToken(token) : Promise.resolve(null);
}

function handleNewClient(socket) {
    socket.on('action', (action, sendBack) => {
        sendBack = sendBack || (() => null);

        loadPlayerFromToken(action.token)
            .then(player => handleAction(socket, action, player))
            .then((result) => sendBack(result),
                  (error) => {
                      log.error({error});
                      sendBack({error});
                  });
    });
    socket.on('disconnect', () => socketService.dissociatePlayerFromSocket(socket.id));
}

export default {
    start
};
