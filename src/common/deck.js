const { shuffle, chunk } = require("common/utils");

const NUMBER_OF_CARDS = 104;
const UNKNOWN_CARD_VALUE = -1;

function generateCard(cardNumber) {
  return {
    value: cardNumber,
    malus: computeMalus(cardNumber),
  };
}

function computeMalus(cardNumber) {
  if (cardNumber === 55) {
    return 7;
  } else if (cardNumber % 11 === 0) {
    return 5;
  } else if (cardNumber % 10 === 0) {
    return 3;
  } else if (cardNumber % 5 === 0) {
    return 2;
  }

  return 1;
}

function generateDeck() {
  let deck = [];
  let cardNumber;

  for (cardNumber = 1; cardNumber <= NUMBER_OF_CARDS; cardNumber++) {
    deck.push(generateCard(cardNumber));
  }

  return deck;
}

function generateGameCards() {
  const deck = shuffle(generateDeck());

  return {
    cardsInPlay: chunk(deck.splice(0, 4), 1),
    hands: chunk(deck, 10),
  };
}

function fullCardFromId(cardId) {
  if (!cardId) {
    return null;
  } else if (cardId === UNKNOWN_CARD_VALUE) {
    return {};
  }

  return {
    value: cardId,
    malus: computeMalus(cardId),
  };
}

module.exports = {
  NUMBER_OF_CARDS,
  UNKNOWN_CARD_VALUE,

  generateDeck,
  generateGameCards,
  computeMalus,
  fullCardFromId,
};
