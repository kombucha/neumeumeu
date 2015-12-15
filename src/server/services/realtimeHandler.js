import log from 'server/log';
import GameStatus from 'common/constants/game-status';
import socketService from 'server/services/socket';
import gameService from 'server/services/game';
import authService from 'server/services/authentication';
import gameplayService from 'server/services/gameplay';

function start() {
    startRealtimeLobbyUpdate();
    startRunningGamesRealtimeUpdate();
}

function startRealtimeLobbyUpdate() {
    log.info('STARTING REALTIME UPDATES FOR LOBBY');
    gameService.onLobbyUpdate(games => {
        socketService.broadcastActionToRoom('lobby', {
            type: 'UPDATE_GAMES',
            games
        });
    });
}

function startGameRealtimeUpdate(gameId) {
    log.info('STARTING REALTIME UPDATES FOR GAME', gameId);
    return gameplayService.listenToGameplayUpdates(gameId, onGameUpdate);
}

function onGameUpdate(game, end) {
    broadcastGameUpdate(game);
    gameplayService.resolveTurn(game.id)
        .then(resolvedGame => {
            broadcastGameUpdate(resolvedGame);
            if (resolvedGame.status === GameStatus.ENDED) {
                end();
            }
        });
}

function broadcastGameUpdate(game) {
    const interestedSockets = socketService.getRoomSocketsIds(game.id);

    Promise.all(interestedSockets.map(authService.getPlayerFromSocket))
        .then(players => {
            players.forEach((player, idx) => {
                const socketId = interestedSockets[idx];
                socketService.emitAction(socketId, {
                    type: 'UPDATE_CURRENT_GAME',
                    game: gameplayService.transformGameplayForPlayer(player.id, game)
                });
            });
        });
}

function startRunningGamesRealtimeUpdate() {
    return gameService.getCurrentGames()
        .then(games => {
            games.forEach(game => startGameRealtimeUpdate(game.id));
        });
}

export default {
    start,
    startGameRealtimeUpdate
};
