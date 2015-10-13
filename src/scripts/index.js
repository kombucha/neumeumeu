import * as deckUtils from './deck';

let deck = deckUtils.generateDeck();
deck = deckUtils.shuffle(deck);

console.log(deck); // eslint-disable-line no-console
