import * as deckUtils from 'common/deck';

describe('deckUtils', () => {
    describe('Deck generation', () => {
        it('should return 104 cards', () => {
            let deck = deckUtils.generateDeck();
            expect(deck.length).to.equal(104);
        });
    });

    describe('Deck shuffling', () => {
        it('should return a new deck', () => {
            let deck = deckUtils.generateDeck(),
                shuffledDeck = deckUtils.shuffle(deck);

            expect(shuffledDeck).to.not.equal(deck);
        });
    });
});
