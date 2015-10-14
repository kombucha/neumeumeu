import * as deckUtils from 'common/deck';

let deck = deckUtils.generateDeck();
deck = deckUtils.shuffle(deck);

console.log(deck); // eslint-disable-line no-console
