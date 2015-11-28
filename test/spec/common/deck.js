import {expect} from 'test/helpers';
import deckUtils from 'common/deck';

describe('deckUtils', () => {
    describe('Deck generation', () => {
        it('should return 104 cards', () => {
            let deck = deckUtils.generateDeck();
            expect(deck.length).to.equal(104);
        });
    });
});
