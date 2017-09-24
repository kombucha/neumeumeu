const { range } = require("neumeumeu-common/utils");
const PlayerStatus = require("neumeumeu-common/constants/player-status");
const ChatConf = require("neumeumeu-common/constants/chat");
const GameStatus = require("neumeumeu-common/constants/game-status");
const r = require("../database");
const { getPlayer } = require("./player");
const { createMessage } = require("./gameplay");

const simpleGameProjection = [
  "id",
  "isProtected",
  "maxPlayers",
  "status",
  "name",
  { players: ["id", "name"] },
];

const MAX_CONCURRENT_GAMES = 5;

function createGamePlayer(player) {
  return {
    id: player.id,
    name: player.name,
    avatarURL: player.avatarURL,
    hand: [],
    chosenCard: null,
    status: PlayerStatus.IDLE,
    malusCards: [],
    AIEnabled: !!player.AIEnabled,
    message: ChatConf.LOGON_HELLO_MESSAGE
      ? createMessage(ChatConf.LOGON_HELLO_MESSAGE, true)
      : null,
  };
}

function createBot() {
  return createGamePlayer({
    id: r.uuid(),
    name: "Bob", // TODO: generate random funny name :)
    avatarURL: undefined, // TODO: robot avatar
    AIEnabled: true,
  });
}

function checkOnGoingGames(playerId) {
  return r
    .table("game")
    .filter(
      r
        .row("owner")
        .eq(playerId)
        .and(r.row("status").ne(GameStatus.ENDED))
    )
    .count()
    .run()
    .then(count => {
      if (count >= MAX_CONCURRENT_GAMES) {
        return Promise.reject("Too many concurrent games");
      }

      return count;
    });
}

function createGame(playerId, options) {
  const maxMalus = isNaN(options.maxMalus)
    ? 66
    : parseInt(options.maxMalus, 10);

  const maxPlayers = isNaN(options.maxPlayers)
    ? 10
    : parseInt(options.maxPlayers, 10);

  const botsCount = isNaN(options.botsCount)
    ? 0
    : Math.min(maxPlayers, parseInt(options.botsCount, 10));

  const newGame = {
    name: options.name,
    enableUserActionTimeout: options.enableUserActionTimeout,
    password: options.password,
    maxMalus,
    maxPlayers,

    creationDate: r.now(),
    status: GameStatus.WAITING_FOR_PLAYERS,
    players: range(Math.max(0, botsCount)).map(createBot),
    owner: playerId,
    cardsInPlay: [[], [], [], []],
  };

  return checkOnGoingGames(playerId)
    .then(() => getPlayer(playerId))
    .then(player => {
      newGame.players = [createGamePlayer(player), ...newGame.players];
      return r
        .table("game")
        .insert(newGame)
        .run();
    })
    .then(result => result["generated_keys"][0]);
}

function joinGame(playerId, gameId, password = "") {
  return getPlayer(playerId).then(player => {
    const gamePlayer = createGamePlayer(player);

    return r
      .table("game")
      .get(gameId)
      .update(
        game => {
          return r.branch(
            // Status OK
            game("status")
              .eq(GameStatus.WAITING_FOR_PLAYERS)
              // AND password OK
              .and(
                game("password")
                  .default("")
                  .eq(password)
              )
              // AND not already joined
              .and(
                game("players")
                  .filter({ id: playerId })
                  .count()
                  .eq(0)
              )
              // AND not already at max capacity
              .and(
                game("players")
                  .count()
                  .lt(game("maxPlayers"))
              ),
            { players: game("players").append(gamePlayer) },
            {}
          );
        },
        { returnChanges: "always" }
      )
      .run()
      .then(result => {
        const game = result.changes[0]["new_val"];
        const hasChanged = result.unchanged !== 1;
        const hasAlreadyJoined = game.players.find(p => p.id === playerId);

        if (hasChanged || hasAlreadyJoined) {
          return game;
        }

        if (game.status !== GameStatus.WAITING_FOR_PLAYERS) {
          return Promise.reject("Can't join game: Already running");
        } else if (game.password && game.password !== password) {
          return Promise.reject("Can't join game: Wrong password");
        } else if (game.players.length >= game.maxPlayers) {
          return Promise.reject("Can't join game: Game is full");
        }

        return Promise.reject("Can't join game: Unknown reason");
      });
  });
}

function getCurrentGames() {
  return r
    .table("game")
    .filter(r.row("status").ne(GameStatus.ENDED))
    .orderBy(r.desc("creationDate"))
    .pluck(...simpleGameProjection)
    .limit(10)
    .run();
}

function onLobbyUpdate(cb) {
  return r
    .table("game")
    .filter(r.row("status").ne(GameStatus.ENDED))
    .pluck(...simpleGameProjection)
    .changes()
    .run()
    .then(cursor => {
      cursor.on("data", () => {
        return getCurrentGames().then(cb);
      });
    });
}

module.exports = {
  createGame,
  joinGame,
  getCurrentGames,
  onLobbyUpdate,
};
