import r from 'server/database';
import {generateGameCards} from 'common/deck';

export default function startRound(gameId) {
    const gameCards = generateGameCards();

    return r.table('game')
        .get(gameId)
        .update({
            status: 'waiting_for_cards',
            cardsInPlay: gameCards.cardsInPlay,
            players: r.row('players')
                .values()
                .map(gameCards.hands, (player, hand) => player.merge({
                    hand,
                    status: 'thinking'
                }))
        })
        .run();
}

export default function playCard(playerId, gameId, cardId) {
    return r.table('game')
        .get(gameId)
        .update(game => {
            return r.branch(
                // Status is waiting_for_cards
                game('status').eq('waiting_for_cards')
                // AND cards in is in players' hand
                .and(game('players').filter({id: playerId})('hand')('value').contains(cardId)),
                {},
                {}
            );
        })
        .run();
}

export default function choosePile(playerId, gameId, columnIdx) {
    // TODO
    return false;
}

// All players have played... time to resolve the game (which card goes where)
export default function resolveTurn(gameId) {
    // TODO:
    // - Resolve where cards should go
    // - Use player choice first, then automatic resolution
    // - If a card can't be placed automatically and there's no player choice, halt and request for player choice
    // - Else resolve cards, start a new turn and return the final state + actions that lead to it
    // ie. describe cards movement {value: cardValue, to: columnIdx} or {player: playerId, to: columnIdx}
    return false;
}
