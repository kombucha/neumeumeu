import r from 'server/database';
import {generateGameCards} from 'common/deck';
import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';
import log from 'server/log';

function startRound(playerId, gameId) {
    const gameCards = generateGameCards();
    // TODO: Check game status before updating
    // AND that there's at least two players
    // AND that the actual owner started the round (maybe ? maybe not...)
    return r.table('game')
        .get(gameId)
        .update({
            status: GameStatus.WAITING_FOR_CARDS,
            cardsInPlay: gameCards.cardsInPlay,
            players: r.row('players')
                .map(gameCards.hands, (player, hand) => player.merge({
                    hand,
                    status: PlayerStatus.CHOOSING_CARD
                }))
        })
        .run();
}

function playCard(playerId, gameId, cardId) {
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

function choosePile(playerId, gameId, columnIdx) {
    // TODO
    return false;
}

// All players have played... time to resolve the game (which card goes where)
function resolveTurn(gameId) {
    // TODO:
    // - Resolve where cards should go
    // - Use player choice first, then automatic resolution
    // - If a card can't be placed automatically and there's no player choice, halt and request for player choice
    // - Else resolve cards, start a new turn and return the final state + actions that lead to it
    // ie. describe cards movement {value: cardValue, to: columnIdx} or {player: playerId, to: columnIdx}
    return false;
}

function onGameplayUpdate(id, cb) {
    return r.table('game')
        .get(id)
        .changes()
        .run()
        .then(cursor => {
            cursor.on('data', data => {
                if (data.new_val && data.new_val.status === GameStatus.ENDED) {
                    log.info("ENDING REALTIME UPDATES FOR GAME ", id);
                    cb(data.new_val);
                    return cursor.close();
                }

                cb(data.new_val);
            });
        });
}

export default {
    startRound,
    onGameplayUpdate
};
