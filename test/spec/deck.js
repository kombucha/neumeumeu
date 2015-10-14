import * as deckUtils from '../../src/scripts/deck';

describe('deckUtils', () => {
    it('should return 104 cards', () => {
        let deck = deckUtils.generateDeck();
        expect(deck.length).to.equal(104);
    });
});
