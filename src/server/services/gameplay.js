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

    return r.table('game')
        .get(gameId)
        .update(game => {
            return r.branch(
                game('players').count().gt(1)
                .and(game('owner').eq(playerId)),
                {
                    status: GameStatus.WAITING_FOR_CARDS,
                    cardsInPlay: gameCards.cardsInPlay,
                    players: game('players')
                        .map(gameCards.hands, (player, hand) => player.merge({
                            hand,
                            status: PlayerStatus.CHOOSING_CARD
                        }))
                },
                {}
            );
        })
        .run();
}

function updatePlayerInGame(gameId, player) {
    return r.table('game')
        .get(gameId)
        // DAMN that's convoluted....
        .update(game => {
            return game('players')
                .offsetsOf(p => p('id').eq(player.id))(0)
                .do(playerIdx => ({
                    players: game('players').changeAt(playerIdx, player)
                }));
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

            return updatePlayerInGame(gameId, newPlayer);
        })
        .then(null, err => log.info(err));
}

function cancelCard(playerId, gameId) {
    return r.table('game')
        .get(gameId)
        .run()
        .then(game => {
            const player = game.players.find(player => player.id === playerId);

            if (game.status !== GameStatus.WAITING_FOR_CARDS) {
                return Promise.reject('You cant play right meow');
            } else if (!player.chosenCard) {
                return Promise.reject('Invalid Move');
            }

            player.hand.push(player.chosenCard);
            player.chosenCard = null;
            player.status = PlayerStatus.CHOOSING_CARD;

            return updatePlayerInGame(gameId, player);
        })
        .then(null, err => log.info(err));
}

function choosePile(playerId, gameId, pileIdx) {
    return r.table('game')
        .get(gameId)
        .run().then(game => {
            const player = game.players.find(p => p.id === playerId);
            if (game.status !== GameStatus.WAITING_FOR_PILE_CHOICE || player.status !== PlayerStatus.HAS_TO_CHOOSE_PILE) {
                return Promise.reject('Invalid move');
            }

            // TODO: probably another status
            game.status = GameStatus.WAITING_FOR_CARDS;
            player.status = PlayerStatus.CHOOSED_PILE;
            player.chosenPile = pileIdx;

            return r.table('game').get(gameId).update(game).run();
        })
        .run();
}

function resolveTurn(gameId) {
    return r.table('game')
        .get(gameId)
        .run()
        .then(game => {
            const everyoneHasPlayed = game.players.every(p => !!p.chosenCard);

            // Abort, turn doesn't end until everyone has played
            if (!everyoneHasPlayed) {
                return Promise.reject('Still waiting for card');
            }

            const someoneHasChosenPile = game.players.some(hasChosenPile),
                pilesTopCards = game.cardsInPlay.map(pile => pile[pile.length - 1]),
                playerHasToChoosePile = player => pilesTopCards.every(topCard => player.chosenCard.value < topCard.value),
                playerWithTooSmallCard = game.players.find(playerHasToChoosePile);

            // Abort, can't resolve turn until player has chosen which piles to take
            if (game.status === GameStatus.WAITING_FOR_PILE_CHOICE && !someoneHasChosenPile) {
                return Promise.reject('Waiting for pile choice');
            }

            // Abort, can't resolve turn. Asks player to chose a pile to take
            if (playerWithTooSmallCard && !hasChosenPile(playerWithTooSmallCard)) {
                game.status = GameStatus.WAITING_FOR_PILE_CHOICE;
                playerWithTooSmallCard.status = PlayerStatus.HAS_TO_CHOOSE_PILE;
                return r.table('game').get(gameId).update(game).run();
            }

            // Resolve turn
            let sortedPlayers = game.players.slice()
                .sort((p1, p2) => p1.chosenCard.value - p2.chosenCard.value);

            // Turn must be solved from lowest card value to biggest
            sortedPlayers.forEach(player => {
                player.malusCards = player.malusCards || [];

                if (hasChosenPile(player)) {
                    // Player played a card smaller than any of the piles
                    let pileCards = game.cardsInPlay[player.chosenPile].splice(0, 5, player.chosenCard);
                    player.malusCards = player.malusCards.concat(pileCards);
                } else {
                    // Regular play
                    const destinationPile = destinationPileIdx(player.chosenCard, game.cardsInPlay);
                    game.cardsInPlay[destinationPile].push(player.chosenCard);

                    // Oh noes !
                    if (game.cardsInPlay[destinationPile].length > 5) {
                        player.malusCards = player.malusCards.concat(game.cardsInPlay[destinationPile].splice(0, 5));
                    }
                }

                player.status = PlayerStatus.IDLE;
                player.chosenPile = null;
                player.chosenCard = null;
            });

            log.info('Mergin in', game.players, game.cardsInPlay);

            return r.table('game').get(gameId).update(game).run();
        });
}

function hasChosenPile(player) {
    return player.chosenPile !== null && player.chosenPile !== undefined;
}

function destinationPileIdx(card, piles) {
    return piles.reduce((resultIdx, pile, idx, piles) => {
        const currentTopCard = pile[pile.length - 1],
            resultPile = piles[resultIdx],
            resultTopCard = resultPile ? resultPile[resultPile.length - 1] : {value: -1};
        return (currentTopCard.value < card.value && currentTopCard.value >= resultTopCard.value) ? idx : resultIdx;
    }, -1);
}

function transformGameplayForPlayer(playerId, game) {
    return Object.assign({}, game, {
        players: game.players.map(player => {
            const shouldReturnFullPlayer = (player.id === playerId || game.status !== GameStatus.WAITING_FOR_CARDS);
            return shouldReturnFullPlayer ? fullPlayer(player) : simplePlayer(player);
        })
    });
}

function fullPlayer(player) {
    return Object.assign({}, player, {
        malus: computeMalus(player.malusCards)
    });
}

function simplePlayer(player) {
    return {
        id: player.id,
        name: player.name,
        status: player.status,
        chosenCard: player.chosenCard ? {} : null,
        malus: computeMalus(player.malusCards)
    };
}

function computeMalus(cards) {
    return cards.reduce((sum, card) => sum + card.malus, 0);
}

function onGameplayUpdate(id, cb) {
    return r.table('game')
        .get(id)
        .changes()
        .run()
        .then(cursor => {
            cursor.on('data', data => {
                if (!data.new_val || data.new_val.status === GameStatus.ENDED) {
                    log.info('ENDING REALTIME UPDATES FOR GAME ', id);
                    cb(data.new_val);
                    return cursor.close();
                }

                // Notify listeners
                cb(data.new_val);

                // Automatically try to resolve turn on each update
                resolveTurn(id);
            });
        });
}

export default {
    startRound,

    playCard,
    cancelCard,
    choosePile,

    resolveTurn,
    getGameplayForPlayer,
    transformGameplayForPlayer,
    onGameplayUpdate
};
