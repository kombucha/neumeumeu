import r from 'server/database';
import {generateGameCards} from 'common/deck';
import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';

export function startRound(playerId, gameId) {
    const gameCards = generateGameCards();
    // TODO: Check game status before updating
    // AND that there's at least two players
    // AND that the actual owner started the round (maybe ? maybe not...)
    return r.table('game')
        .get(gameId)
        .update({
            status: GameStatus.WAITING_FOR_CARDS,
            cardsInPlay: gameCards.cardsInPlay,
            // FIXME: Seems convoluted to me, search if there's a better way...
            players: r.row('players')
                .values()
                .map(gameCards.hands, (player, hand) => [
                    player('id'),
                    player.merge({
                        hand,
                        status: PlayerStatus.CHOOSING_CARD
                    })
                ])
                .coerceTo('object')
        })
        .run();
}

export function playCard(playerId, gameId, cardId) {
    return r.table('game')
        .get(gameId)
        .update(game => {
            return r.branch(
                // Status is waiting_for_cards
                game('status').eq(GameStatus.WAITING_FOR_CARDS)
                // AND cards in is in players' hand
                .and(game('players').filter({id: playerId})('hand')('value').contains(cardId)),
                {},
                {}
            );
        })
        .run();
}

export function choosePile(playerId, gameId, columnIdx) {
    // TODO
    return false;
}

// All players have played... time to resolve the game (which card goes where)
export function resolveTurn(gameId) {
    // TODO:
    // - Resolve where cards should go
    // - Use player choice first, then automatic resolution
    // - If a card can't be placed automatically and there's no player choice, halt and request for player choice
    // - Else resolve cards, start a new turn and return the final state + actions that lead to it
    // ie. describe cards movement {value: cardValue, to: columnIdx} or {player: playerId, to: columnIdx}
    return false;
}

export default {
    startRound
};
