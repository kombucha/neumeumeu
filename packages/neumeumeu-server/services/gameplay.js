const { UNKNOWN_CARD_VALUE, generateGameCards } = require("common/deck");
const { dateInSeconds, sum, sortBy } = require("common/utils");
const Errors = require("common/constants/errors");
const GameStatus = require("common/constants/game-status");
const PlayerStatus = require("common/constants/player-status");
const ChatConf = require("common/constants/chat");
const r = require("server/database");
const ai = require("server/services/ai");
const GameplayConstants = require("common/constants/gameplay");

// Data
function getGame(id) {
  return r
    .table("game")
    .get(id)
    .run();
}

function updateGame(game) {
  return r
    .table("game")
    .get(game.id)
    .update(game, { returnChanges: true })
    .run()
    .then(result => {
      if (result.changes.length === 0) {
        return game;
      }

      return result.changes[0]["new_val"];
    });
}

function updatePlayerInGame(gameId, player) {
  return (
    r
      .table("game")
      .get(gameId)
      // DAMN that's convoluted...
      .update(
        game =>
          game("players").offsetsOf(p => p("id").eq(player.id))(
            0
          ).do(playerIdx => ({
            players: game("players").changeAt(
              playerIdx,
              game("players")(playerIdx).merge(player)
            ),
          })),
        { returnChanges: "always" }
      )
      .run()
      .then(result => {
        return result.changes[0]["new_val"];
      })
  );
}

function getGameplayForPlayer(playerId, gameId) {
  return getGame(gameId).then(game =>
    transformGameplayForPlayer(playerId, game)
  );
}

function listenToGameplayUpdates(id, updateCallback) {
  return r
    .table("game")
    .get(id)
    .changes({ squash: 0.2, includeInitial: true })
    .run()
    .then(cursor => {
      cursor.on("data", data => {
        updateCallback(data.new_val, data.old_val, cursor.close.bind(cursor));
      });
    });
}

// Player actions
function startRound(playerId, gameId) {
  return getGame(gameId)
    .then(game => {
      if (game.players.length < 2 || game.owner !== playerId) {
        return Promise.reject(game);
      }

      const gameCards = generateGameCards();

      game.status = GameStatus.WAITING_FOR_CARDS;
      game.cardsInPlay = sortBy(pile => pile[0].value, gameCards.cardsInPlay);
      game.players = game.players.map((player, idx) =>
        Object.assign({}, player, {
          hand: gameCards.hands[idx],
          chosenCard: null,
          chosenPile: null,
          message: null,
          status: PlayerStatus.CHOOSING_CARD,
        })
      );
      game.resolutionSteps = null;

      return updateGame(game);
    })
    .then(returnEmptyObject);
}

function playCard(playerId, gameId, cardValue) {
  return getGame(gameId)
    .then(game => {
      const newPlayer = game.players.find(player => player.id === playerId);

      //If cardValue = AUTO_CARD_VALUE => Use Ai to choose card
      if (cardValue === GameplayConstants.AUTO_CARD_VALUE) {
        cardValue = ai.chooseCard(
          newPlayer.hand,
          game.cardsInPlay,
          game.players.length
        );
      }

      const cardIdx = newPlayer.hand.findIndex(
        card => card.value === cardValue
      );
      const userOwnsCard = cardIdx !== -1;

      if (game.status !== GameStatus.WAITING_FOR_CARDS || !userOwnsCard) {
        return Promise.reject(Errors.INVALID_MOVE);
      }

      if (newPlayer.chosenCard) {
        newPlayer.hand.push(newPlayer.chosenCard);
      }

      newPlayer.status = PlayerStatus.PLAYED_CARD;
      newPlayer.chosenCard = newPlayer.hand[cardIdx];
      newPlayer.hand.splice(cardIdx, 1);

      return updatePlayerInGame(game.id, newPlayer);
    })
    .then(returnEmptyObject);
}

function cancelCard(playerId, gameId) {
  return getGame(gameId)
    .then(game => {
      const player = game.players.find(player => player.id === playerId);

      if (game.status !== GameStatus.WAITING_FOR_CARDS || !player.chosenCard) {
        return Promise.reject(Errors.INVALID_MOVE);
      }

      player.hand.push(player.chosenCard);
      player.chosenCard = null;
      player.status = PlayerStatus.CHOOSING_CARD;

      return updatePlayerInGame(game.id, player);
    })
    .then(returnEmptyObject);
}

function sendChatMessage(playerId, gameId, messageText) {
  return checkMessage(messageText)
    .then(() => getGame(gameId))
    .then(game => {
      const newPlayer = game.players.find(player => player.id === playerId);
      newPlayer.message = createMessage(messageText);

      return updatePlayerInGame(game.id, newPlayer);
    })
    .then(returnEmptyObject);
}

function choosePile(playerId, gameId, pileIdx) {
  return getGame(gameId)
    .then(game => {
      const player = game.players.find(p => p.id === playerId);
      if (
        game.status !== GameStatus.WAITING_FOR_PILE_CHOICE ||
        player.status !== PlayerStatus.HAS_TO_CHOOSE_PILE
      ) {
        return Promise.reject(Errors.INVALID_MOVE);
      }

      //If pileIdx = AUTO_PILE_VALUE => Use Ai to choose pile
      if (pileIdx === GameplayConstants.AUTO_PILE_VALUE) {
        pileIdx = ai.choosePileIdx(game.cardsInPlay);
      }

      player.status = PlayerStatus.CHOOSED_PILE;
      player.chosenPile = pileIdx;

      return updatePlayerInGame(game.id, player);
    })
    .then(returnEmptyObject);
}

function toggleAI(playerId, gameId, enable) {
  return updatePlayerInGame(gameId, { id: playerId, AIEnabled: enable }).then(
    returnEmptyObject
  );
}

function playerReady(playerId, gameId) {
  return getGame(gameId)
    .then(game => {
      if (game.status !== GameStatus.SOLVED) {
        return Promise.reject(Errors.INVALID_ACTION);
      }

      return updatePlayerInGame(game.id, {
        id: playerId,
        status: PlayerStatus.READY_FOR_NEXT_ROUND,
      });
    })
    .then(returnEmptyObject);
}

// Game rules
function resolveTurn(gameId) {
  // FIXME: Game fetched many times :/
  return getGame(gameId)
    .then(playAIs)
    .then(() => getGame(gameId))
    .then(solve)
    .then(solveEnd);
}

function solve(game) {
  const everyoneHasPlayed = game.players.every(p => p.chosenCard);

  if (
    game.status === GameStatus.SOLVED ||
    game.status === GameStatus.WAITING_FOR_PLAYERS ||
    (game.status === GameStatus.WAITING_FOR_CARDS && !everyoneHasPlayed)
  ) {
    return Promise.resolve(game);
  }

  const sortedPlayers = sortBy(p => p.chosenCard.value, game.players);
  const pilesTopCards = game.cardsInPlay.map(pile => pile[pile.length - 1]);

  const playerHasToChoosePile = player =>
    pilesTopCards.every(topCard => player.chosenCard.value < topCard.value);

  const playerWithTooSmallCard = sortedPlayers.find(playerHasToChoosePile);
  const someoneHasChosenPile = sortedPlayers.some(hasChosenPile);

  // Wait for player to chose pile
  if (
    game.status === GameStatus.WAITING_FOR_PILE_CHOICE &&
    !someoneHasChosenPile
  ) {
    return Promise.resolve(game);
  }

  // Ask player to chose a pile
  if (playerWithTooSmallCard && !hasChosenPile(playerWithTooSmallCard)) {
    game.status = GameStatus.WAITING_FOR_PILE_CHOICE;
    playerWithTooSmallCard.status = PlayerStatus.HAS_TO_CHOOSE_PILE;
    return updateGame(game);
  }

  // Solve
  const resolutionSteps = [];

  game.status = GameStatus.SOLVED;
  sortedPlayers.forEach(player => {
    player.malusCards = player.malusCards || [];
    const playerIdx = game.players.findIndex(p => p.id === player.id);

    if (hasChosenPile(player)) {
      // Player played a card smaller than any of the piles
      let pileCards = game.cardsInPlay[player.chosenPile].splice(
        0,
        5,
        player.chosenCard
      );
      player.malusCards = player.malusCards.concat(pileCards);
      resolutionSteps.push({
        fromPile: player.chosenPile,
        toPlayer: playerIdx,
      });
      resolutionSteps.push({
        fromPlayer: playerIdx,
        toPile: player.chosenPile,
      });
    } else {
      // Regular play
      const destinationPile = destinationPileIdx(
        player.chosenCard,
        game.cardsInPlay
      );
      game.cardsInPlay[destinationPile].push(player.chosenCard);

      // Oh noes !
      if (game.cardsInPlay[destinationPile].length > 5) {
        player.malusCards = player.malusCards.concat(
          game.cardsInPlay[destinationPile].splice(0, 5)
        );
        resolutionSteps.push({
          fromPile: destinationPile,
          toPlayer: playerIdx,
        });
      }

      resolutionSteps.push({ fromPlayer: playerIdx, toPile: destinationPile });
    }

    player.status = PlayerStatus.IDLE;
    player.chosenPile = null;
    player.chosenCard = null;
  });

  game.resolutionSteps = resolutionSteps;

  return updateGame(game);
}

function solveEnd(game) {
  const stillCardsToPlay = game.players.some(p => p.hand.length > 0);

  const everyoneReadyForNextTurn = game.players.every(
    p => p.status === PlayerStatus.READY_FOR_NEXT_ROUND
  );

  const endReached = isEndReached(game);

  if (game.status !== GameStatus.SOLVED || !everyoneReadyForNextTurn) {
    return Promise.resolve(game);
  } else if (stillCardsToPlay) {
    game.status = GameStatus.WAITING_FOR_CARDS;
    game.players = game.players.map(p => {
      p.status = PlayerStatus.CHOOSING_CARD;
      return p;
    });
    return updateGame(game);
  } else if (endReached) {
    game.status = GameStatus.ENDED;
    game.resolutionSteps = null;
    return updateGame(game);
  } else {
    return startRound(game.owner, game.id);
  }
}

function playAIs(game) {
  const aiActions = game.players.filter(p => p.AIEnabled).map(p => {
    if (p.status === PlayerStatus.CHOOSING_CARD) {
      const cardId = ai.chooseCard(
        p.hand,
        game.cardsInPlay,
        game.players.length
      );
      return playCard(p.id, game.id, cardId);
    } else if (p.status === PlayerStatus.HAS_TO_CHOOSE_PILE) {
      const chosenPile = ai.choosePileIdx(game.cardsInPlay);
      return choosePile(p.id, game.id, chosenPile);
    } else if (game.status === GameStatus.SOLVED) {
      return playerReady(p.id, game.id);
    }
  });

  return Promise.all(aiActions);
}

function isEndReached(game) {
  return game.players
    .map(p => computeTotalCardMalus(p.malusCards))
    .some(malus => malus >= game.maxMalus);
}

function hasChosenPile(player) {
  return player.chosenPile !== null && player.chosenPile !== undefined;
}

function destinationPileIdx(card, piles) {
  return piles.reduce((resultIdx, pile, idx, piles) => {
    const currentTopCard = pile[pile.length - 1];
    const resultPile = piles[resultIdx];
    const resultTopCard = resultPile
      ? resultPile[resultPile.length - 1]
      : { value: -1 };
    return currentTopCard.value < card.value &&
    currentTopCard.value >= resultTopCard.value
      ? idx
      : resultIdx;
  }, -1);
}

// Data helpers
function transformGameplayForPlayer(
  playerId,
  game,
  withResolutionSteps = false
) {
  return Object.assign({}, game, {
    cardsInPlay: game.cardsInPlay.map(pile => pile.map(simpleCard)),
    resolutionSteps: withResolutionSteps ? game.resolutionSteps : null,
    players: game.players.map(player => {
      const shouldReturnFullPlayer =
        player.id === playerId || game.status !== GameStatus.WAITING_FOR_CARDS;
      return shouldReturnFullPlayer ? fullPlayer(player) : otherPlayer(player);
    }),
  });
}

function fullPlayer(player) {
  return Object.assign({}, player, {
    hand: player.hand.map(simpleCard),
    chosenCard: simpleCard(player.chosenCard),
    malusCards: player.malusCards.map(simpleCard),
    malus: computeTotalCardMalus(player.malusCards),
    message: getMessage(player),
  });
}

function otherPlayer(player) {
  return {
    id: player.id,
    name: player.name,
    status: player.status,
    avatarURL: player.avatarURL,
    chosenCard: simpleCard(
      player.chosenCard ? { value: UNKNOWN_CARD_VALUE } : null
    ),
    malus: computeTotalCardMalus(player.malusCards),
    AIEnabled: player.AIEnabled,
    message: getMessage(player),
  };
}

function getMessage(player) {
  if (player.message && player.message.text.length > 0) {
    var expireDate =
      dateInSeconds(player.message.date) +
      ChatConf.MESSAGE_EXPIRE_INTERVAL / 1000; //ms => s
    if (expireDate > dateInSeconds(Date.now())) {
      player.message.expire = (expireDate - dateInSeconds(Date.now())) * 1000; //s => ms
      player.message.notificationEffect = ChatConf.MESSAGE_ANIMATE_EFFECT;
      return player.message;
    }
  }
  return null;
}

function simpleCard(card) {
  return card ? card.value : null;
}

function computeTotalCardMalus(cards) {
  return sum("malus", cards);
}

function returnEmptyObject() {
  return {};
}

function checkMessage(messageText) {
  if (
    messageText.length > 0 &&
    messageText.length <= ChatConf.MESSAGE_MAX_LENGTH
  ) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}
function createMessage(messageText, auto = false) {
  return {
    text: messageText,
    expire: ChatConf.MESSAGE_EXPIRE_INTERVAL,
    date: Date.now(),
    autoMessage: auto,
  };
}

module.exports = {
  startRound,

  playCard,
  cancelCard,
  sendChatMessage,
  choosePile,
  toggleAI,
  playerReady,
  createMessage,

  resolveTurn,
  getGameplayForPlayer,
  transformGameplayForPlayer,
  listenToGameplayUpdates,
};
