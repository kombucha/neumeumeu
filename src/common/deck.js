import {shuffle, chunk} from 'common/utils';

const NUMBER_OF_CARDS = 104;

function generateCard(cardNumber) {
    return {
        value: cardNumber,
        malus: computePenality(cardNumber)
    };
}

function computePenality(cardNumber) {
    if (cardNumber === 55) {
        return 7;
    } else if (cardNumber % 10 === 0) {
        return 3;
    } else if (cardNumber % 5 === 0) {
        return 2;
    }

    return 1;
}

export function generateDeck() {
    let deck = [], cardNumber;

    for (cardNumber = 1; cardNumber <= NUMBER_OF_CARDS; cardNumber++) {
        deck.push(generateCard(cardNumber));
    }

    return deck;
}

export function generateGameCards() {
    const deck = shuffle(generateDeck());

    return {
        cardsInPlay: chunk(deck.splice(0, 4), 1),
        hands: chunk(deck, 10)
    };
}

export default {
    generateDeck,
    generateGameCards

};
