const noOpPromise = () => Promise.resolve({});

function init() {}

function login() {
  return Promise.resolve(require("./mocks/login.json"));
}

function createGame() {
  return Promise.resolve({});
}

function fetchGames() {
  return Promise.resolve(require("./mocks/currentGames.json"));
}

function getGame(gameId) {
  const response = Object.assign({}, require("./mocks/gameInProgress.json"), {
    id: gameId,
  });

  return Promise.resolve(response);
}

export default {
  init,

  login,
  logout: noOpPromise,
  associateSocketToPlayer: noOpPromise,

  joinRoom: noOpPromise,
  leaveRoom: noOpPromise,

  playerReady: noOpPromise,
  createGame,
  fetchGames,
  getGame,
  joinGame: noOpPromise,

  startGame: noOpPromise,
  playCard: noOpPromise,
  cancelCard: noOpPromise,
  choosePile: noOpPromise,
};
