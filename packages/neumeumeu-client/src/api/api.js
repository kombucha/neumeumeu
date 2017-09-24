let socket;
let store;

function init(_socket, _store) {
  socket = _socket;
  store = _store;
  window.socket = socket;
}

function getAuthToken() {
  return store.getState().authentication.token;
}

function emitAction(action, waitForResponse = true) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject("Api was not initialized");
    }

    const cb = waitForResponse
      ? result => {
          if (result.error) {
            return reject(result.error);
          }

          return resolve(result);
        }
      : undefined;

    socket.emit("action", action, cb);

    if (!waitForResponse) {
      return Promise.resolve(action);
    }
  }).catch(result => {
    console.warn(
      `Received error "${JSON.stringify(result, null, 2)}" for action`,
      action
    ); // eslint-disable-line no-console
    return Promise.reject(result);
  });
}

function login(googleAuthCode) {
  return emitAction({
    type: "LOGIN",
    googleAuthCode,
  });
}

function logout() {
  return emitAction({
    type: "LOGOUT",
    token: getAuthToken(),
  });
}

function associateSocketToPlayer(playerId, socketId) {
  return emitAction({
    type: "ASSOCIATE_PLAYER_TO_SOCKET",
    playerId,
    socketId,
  });
}

function getGame(id) {
  return emitAction({
    type: "GET_GAME",
    token: getAuthToken(),
    id,
  });
}

function fetchGames() {
  return emitAction({
    type: "UPDATE_GAMES",
  });
}

function createGame(game) {
  return emitAction({
    type: "CREATE_GAME",
    token: getAuthToken(),
    game,
  });
}

function joinGame(id) {
  return emitAction({
    type: "JOIN_GAME",
    token: getAuthToken(),
    id,
  });
}

function startGame(id) {
  return emitAction({
    type: "START_GAME",
    token: getAuthToken(),
    id,
  });
}

function playCard(gameId, cardValue) {
  return emitAction({
    type: "PLAY_CARD",
    token: getAuthToken(),
    gameId,
    cardValue,
  });
}

function cancelCard(gameId) {
  return emitAction({
    type: "CANCEL_CARD",
    token: getAuthToken(),
    gameId,
  });
}

function choosePile(gameId, pile) {
  return emitAction({
    type: "CHOOSE_PILE",
    token: getAuthToken(),
    gameId,
    pile,
  });
}

function playerReady(gameId) {
  return emitAction({
    type: "PLAYER_READY",
    token: getAuthToken(),
    gameId,
  });
}

function joinRoom(id) {
  return emitAction({
    type: "JOIN_ROOM",
    token: getAuthToken(),
    id,
  });
}

function leaveRoom(id) {
  return emitAction({
    type: "LEAVE_ROOM",
    token: getAuthToken(),
    id,
  });
}

function sendChatMessage(gameId, messageText) {
  return emitAction({
    type: "SEND_CHAT_MESSAGE",
    token: getAuthToken(),
    gameId,
    messageText,
  });
}

export default {
  init,

  login,
  logout,
  associateSocketToPlayer,

  joinRoom,
  leaveRoom,

  createGame,
  fetchGames,
  getGame,
  joinGame,

  startGame,
  playCard,
  cancelCard,
  choosePile,
  playerReady,
  sendChatMessage,
};
