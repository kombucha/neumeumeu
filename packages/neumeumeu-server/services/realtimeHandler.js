const log = require("../log");
const GameStatus = require("neumeumeu-common/constants/game-status");
const socketService = require("./socket");
const gameService = require("./game");
const gameplayService = require("./gameplay");

function start() {
  startRealtimeLobbyUpdate();
  startRunningGamesRealtimeUpdate();
}

function startRealtimeLobbyUpdate() {
  log.info("Starting realtime updates for lobby");
  gameService.onLobbyUpdate(games => {
    socketService.broadcastActionToRoom("lobby", {
      type: "UPDATE_GAMES",
      games,
    });
  });
}

function startGameRealtimeUpdate(gameId) {
  log.info("Starting realtime updates for game", gameId);
  return gameplayService.listenToGameplayUpdates(gameId, onGameUpdate);
}

function onGameUpdate(newGame, oldGame, end) {
  if (!newGame || newGame.status === GameStatus.ENDED) {
    newGame && broadcastGameUpdate(newGame);
    return end();
  }

  log.info("Game update", newGame.id, newGame.status);

  const shouldSendResolutionSteps =
    newGame.status === GameStatus.SOLVED &&
    oldGame &&
    oldGame.status !== newGame.status;

  const shouldSendUpdate = newGame.status !== GameStatus.SOLVED || !oldGame;

  // When game is solved, send a special game object
  // With details as to how to solve the game
  // So that we can play super duper animations
  if (shouldSendResolutionSteps) {
    const hybridGame = Object.assign({}, oldGame, {
      status: GameStatus.SOLVED,
      resolutionSteps: newGame.resolutionSteps,
    });

    return broadcastGameUpdate(hybridGame, true);
  } else if (shouldSendUpdate) {
    broadcastGameUpdate(newGame);
  }

  gameplayService.resolveTurn(newGame.id);
}

function broadcastGameUpdate(game, withResolutionSteps) {
  const interestedSockets = socketService.getRoomSocketsIds(game.id);

  Promise.all(
    interestedSockets.map(socketService.getPlayerFromSocket)
  ).then(players => {
    players.forEach((player, idx) => {
      const socketId = interestedSockets[idx];
      socketService.emitAction(socketId, {
        type: "UPDATE_CURRENT_GAME",
        game: gameplayService.transformGameplayForPlayer(
          player.id,
          game,
          withResolutionSteps
        ),
      });
    });
  });
}

function startRunningGamesRealtimeUpdate() {
  return gameService.getCurrentGames().then(games => {
    games.forEach(game => startGameRealtimeUpdate(game.id));
  });
}

module.exports = {
  start,
  startGameRealtimeUpdate,
};
