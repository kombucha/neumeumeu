const log = require("../log");
const socketService = require("./socket");
const gameService = require("./game");
const gameplayService = require("./gameplay");
const authService = require("./authentication");
const realtimeHandler = require("./realtimeHandler");

function start() {
  socketService.on("connection", handleNewClient);
}

function handleAction(socket, action, player) {
  log.info({ action });

  switch (action.type) {
    case "LOGIN":
      return authService.loginFromGoogle(action.googleAuthCode).then(result => {
        socketService.associatePlayerWithSocket(result.player.id, socket.id);
        return result;
      });
    case "LOGOUT":
      return authService.logout(action.token).then(result => {
        socketService.dissociatePlayerFromSocket(socket.id);
        return result;
      });
    case "ASSOCIATE_PLAYER_TO_SOCKET":
      return socketService.associatePlayerWithSocket(
        action.playerId,
        action.socketId
      );

    case "JOIN_ROOM":
      return socketService.joinRoom(socket, action.id);
    case "LEAVE_ROOM":
      return socketService.leaveRoom(socket, action.id);

    case "JOIN_GAME":
      return gameService
        .joinGame(player.id, action.id)
        .then(game =>
          gameplayService.transformGameplayForPlayer(player.id, game)
        );
    case "CREATE_GAME":
      return gameService.createGame(player.id, action.game).then(gameId => {
        realtimeHandler.startGameRealtimeUpdate(gameId);
        return gameId;
      });
    case "UPDATE_GAMES":
      return gameService.getCurrentGames();

    case "GET_GAME":
      return gameplayService.getGameplayForPlayer(player.id, action.id);
    case "START_GAME":
      return gameplayService.startRound(player.id, action.id);
    case "PLAY_CARD":
      return gameplayService.playCard(
        player.id,
        action.gameId,
        action.cardValue
      );
    case "CANCEL_CARD":
      return gameplayService.cancelCard(player.id, action.gameId);
    case "CHOOSE_PILE":
      return gameplayService.choosePile(player.id, action.gameId, action.pile);
    case "PLAYER_READY":
      return gameplayService.playerReady(player.id, action.gameId);
    case "SEND_CHAT_MESSAGE":
      return gameplayService.sendChatMessage(
        player.id,
        action.gameId,
        action.messageText
      );

    default:
      return Promise.reject(`Unhandled action: ${action.type}`);
  }
}

function loadPlayerFromToken(token) {
  return token ? authService.getPlayerFromToken(token) : Promise.resolve(null);
}

function handleNewClient(socket) {
  socket.on("action", (action, sendBack) => {
    sendBack = sendBack || (() => null);

    loadPlayerFromToken(action.token)
      .then(player => handleAction(socket, action, player))
      .then(
        result => sendBack(result),
        error => {
          log.error({ error });
          sendBack({ error });
        }
      );
  });
  socket.on("disconnect", () =>
    socketService.dissociatePlayerFromSocket(socket.id)
  );
}

module.exports = { start };
