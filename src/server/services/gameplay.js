import r from 'server/database';
import {generateGameCards} from 'common/deck';
import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';
import log from 'server/log';

function getGameplayForPlayer(playerId, gameId) {
    return r.table('game')
        .get(gameId)
        .run()
        .then(game => transformGameplayForPlayer(playerId, game));
}

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

function playCard(playerId, gameId, cardValue) {
    return r.table('game')
        .get(gameId)
        .run()
        .then(game => {
            const newPlayer = game.players.find(player => player.id === playerId),
                cardIdx = newPlayer.hand.findIndex(card => card.value === cardValue),
                userOwnsCard = cardIdx !== -1;

            if (game.status !== GameStatus.WAITING_FOR_CARDS) {
                return Promise.reject('You cant play right meow');
            } else if (!userOwnsCard) {
                return Promise.reject('Invalid Move');
            }

            if (newPlayer.chosenCard) {
                newPlayer.hand.push(newPlayer.chosenCard);
            }

            newPlayer.status = PlayerStatus.PLAYED_CARD;
            newPlayer.chosenCard = newPlayer.hand[cardIdx];
            newPlayer.hand.splice(cardIdx, 1);

            return r.table('game')
                .get(gameId)
                // DAMN that's convoluted....
                .update(game => {
                    return game('players')
                        .offsetsOf(player => player('id').eq(playerId))(0)
                        .do(playerIdx => ({
                            players: game('players').changeAt(playerIdx, newPlayer)
                        }));
                })
                .run();
        })
        .then(null, err => log.info(err));
}

// function choosePile(playerId, gameId, columnIdx) {
//     // TODO
//     return false;
// }

// All players have played... time to resolve the game (which card goes where)
// function resolveTurn(gameId) {
    // TODO:
    // - Resolve where cards should go
    // - Use player choice first, then automatic resolution
    // - If a card can't be placed automatically and there's no player choice, halt and request for player choice
    // - Else resolve cards, start a new turn and return the final state + actions that lead to it
    // ie. describe cards movement {value: cardValue, to: columnIdx} or {player: playerId, to: columnIdx}
//     return false;
// }

function transformGameplayForPlayer(playerId, game) {
    // TODO: Only filter chosenCard when gameStatus should not be revealed
    return Object.assign({}, game, {
        players: game.players.map(player => {
            return player.id === playerId
                ? player
                : {
                    id: player.id,
                    name: player.name,
                    status: player.status,
                    chosenCard: {}
                };
        })
    });
}

function onGameplayUpdate(id, cb) {
    return r.table('game')
        .get(id)
        .changes()
        .run()
        .then(cursor => {
            cursor.on('data', data => {
                if (data.new_val && data.new_val.status === GameStatus.ENDED) {
                    log.info('ENDING REALTIME UPDATES FOR GAME ', id);
                    cb(data.new_val);
                    return cursor.close();
                }

                cb(data.new_val);
            });
        });
}

export default {
    getGameplayForPlayer,
    startRound,
    playCard,

    onGameplayUpdate,
    transformGameplayForPlayer
};
