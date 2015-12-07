import {fullCardFromId} from 'common/deck';

function inflateGame(game) {
    return Object.assign({}, game, {
        cardsInPlay: game.cardsInPlay.map(pile => pile.map(fullCardFromId)),
        players: game.players.map(p => {
            p.chosenCard = fullCardFromId(p.chosenCard);
            p.hand = p.hand ? p.hand.map(fullCardFromId) : undefined;
            return p;
        })
    });
}

export default (/* store */) => next => action => {
    if (action.type === 'UPDATE_CURRENT_GAME') {
        action = Object.assign({}, action, {
            game: inflateGame(action.game)
        });
    }

    return next(action);
};
