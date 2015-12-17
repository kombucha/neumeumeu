import r from 'server/database';
import {UNKNOWN_CARD_VALUE, generateGameCards} from 'common/deck';
import {copyArray, pickRandom, randomInt} from 'common/utils';
import Errors from 'common/constants/errors';
import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';
import log from 'server/log';

// Data
function getGame(id) {
    return r.table('game').get(id).run();
}

function updateGame(game) {
    return r.table('game')
        .get(game.id)
        .update(game, {returnChanges: true})
        .run()
        .then(result => {
            if (result.changes.length === 0) {
                return game;
            }

            return result.changes[0]['new_val'];
        });
}

function updatePlayerInGame(gameId, player) {
    log.info('UPDATING PLAYER ', gameId, player);
    return r.table('game')
        .get(gameId)
        // DAMN that's convoluted...
        .update(game => {
            return game('players')
                .offsetsOf(p => p('id').eq(player.id))(0)
                .do(playerIdx => ({
                    players: game('players')
                        .changeAt(playerIdx, game('players')(playerIdx).merge(player))
                }));
        }, {returnChanges: true})
        .run()
        .then(result => {
            if (result.changes.length === 0) {
                return {}; // FIXME: :/
            }

            return result.changes[0]['new_val'];
        });
}

function getGameplayForPlayer(playerId, gameId) {
    return getGame(gameId).then(game => transformGameplayForPlayer(playerId, game));
}

function listenToGameplayUpdates (id, updateCallback) {
    return r.table('game')
        .get(id)
        .changes({squash: 0.2, includeInitial: true})
        .run()
        .then(cursor => {
            cursor.on('data', data => {
                updateCallback(data.new_val, data.old_val, cursor.close.bind(cursor));
            });
        });
}

// Player actions
function startRound(playerId, gameId) {
    return getGame(gameId)
        .then(game => {
            if (game.players.length < 2 || game.owner !== playerId) {
                return Promise.reject(game);
            }

            const gameCards = generateGameCards();

            game.status = GameStatus.WAITING_FOR_CARDS;
            game.cardsInPlay = gameCards.cardsInPlay.sort((pile1, pile2) => pile1[0].value - pile2[0].value);
            game.players = game.players.map((player, idx) => Object.assign({}, player, {
                hand: gameCards.hands[idx],
                chosenCard: null,
                chosenPile: null,
                status: PlayerStatus.CHOOSING_CARD
            }));
            game.resolutionSteps = null;

            return updateGame(game);
        })
        .then(returnEmptyObject);
}

function playCard(playerId, gameId, cardValue) {
    return getGame(gameId)
        .then(game => {
            const newPlayer = game.players.find(player => player.id === playerId),
                cardIdx = newPlayer.hand.findIndex(card => card.value === cardValue),
                userOwnsCard = cardIdx !== -1;

            if (game.status !== GameStatus.WAITING_FOR_CARDS || !userOwnsCard) {
                return Promise.reject(Errors.INVALID_MOVE);
            }

            if (newPlayer.chosenCard) {
                newPlayer.hand.push(newPlayer.chosenCard);
            }

            newPlayer.status = PlayerStatus.PLAYED_CARD;
            newPlayer.chosenCard = newPlayer.hand[cardIdx];
            newPlayer.hand.splice(cardIdx, 1);

            return updatePlayerInGame(game.id, newPlayer);
        })
        .then(returnEmptyObject);
}

function cancelCard(playerId, gameId) {
    return getGame(gameId)
        .then(game => {
            const player = game.players.find(player => player.id === playerId);

            if (game.status !== GameStatus.WAITING_FOR_CARDS || !player.chosenCard) {
                return Promise.reject(Errors.INVALID_MOVE);
            }

            player.hand.push(player.chosenCard);
            player.chosenCard = null;
            player.status = PlayerStatus.CHOOSING_CARD;

            return updatePlayerInGame(game.id, player);
        })
        .then(returnEmptyObject);
}

function choosePile(playerId, gameId, pileIdx) {
    return getGame(gameId)
        .then(game => {
            const player = game.players.find(p => p.id === playerId);
            if (game.status !== GameStatus.WAITING_FOR_PILE_CHOICE || player.status !== PlayerStatus.HAS_TO_CHOOSE_PILE) {
                return Promise.reject(Errors.INVALID_MOVE);
            }

            player.status = PlayerStatus.CHOOSED_PILE;
            player.chosenPile = pileIdx;

            return updatePlayerInGame(game.id, player);
        })
        .then(returnEmptyObject);
}

function toggleAI(playerId, gameId, enable) {
    return updatePlayerInGame(gameId, {id: playerId, AIEnabled: enable})
        .then(returnEmptyObject);
}

function playerReady(playerId, gameId) {
    return getGame(gameId)
        .then(game => {
            if (game.status !== GameStatus.SOLVED) {
                return Promise.reject(Errors.INVALID_ACTION);
            }

            return updatePlayerInGame(game.id, {id: playerId, status: PlayerStatus.READY_FOR_NEXT_ROUND});
        })
        .then(returnEmptyObject);
}

// Game rules
function resolveTurn(gameId) {
    // FIXME: Game fetched many times :/
    return getGame(gameId)
        .then(playAIs)
        .then(() => getGame(gameId))
        .then(solve)
        .then(solveEnd);
}

function solve(game) {
    const everyoneHasPlayed = game.players.every(p => p.chosenCard);

    if (game.status === GameStatus.SOLVED ||
        game.status === GameStatus.WAITING_FOR_PLAYERS ||
        (game.status === GameStatus.WAITING_FOR_CARDS && !everyoneHasPlayed)) {
        return Promise.resolve(game);
    }

    const sortedPlayers = copyArray(game.players).sort((p1, p2) => p1.chosenCard.value - p2.chosenCard.value),
        pilesTopCards = game.cardsInPlay.map(pile => pile[pile.length - 1]),
        playerHasToChoosePile = player => pilesTopCards.every(topCard => player.chosenCard.value < topCard.value),
        playerWithTooSmallCard = sortedPlayers.find(playerHasToChoosePile),
        someoneHasChosenPile = sortedPlayers.some(hasChosenPile);

    // Wait for player to chose pile
    if (game.status === GameStatus.WAITING_FOR_PILE_CHOICE && !someoneHasChosenPile) {
        return Promise.resolve(game);
    }

    // Ask player to chose a pile
    if (playerWithTooSmallCard && !hasChosenPile(playerWithTooSmallCard)) {
        game.status = GameStatus.WAITING_FOR_PILE_CHOICE;
        playerWithTooSmallCard.status = PlayerStatus.HAS_TO_CHOOSE_PILE;
        return updateGame(game);
    }

    // Solve
    const resolutionSteps = [];

    game.status = GameStatus.SOLVED;
    sortedPlayers.forEach(player => {
        player.malusCards = player.malusCards || [];
        const playerIdx = game.players.findIndex(p => p.id === player.id);

        if (hasChosenPile(player)) {
            // Player played a card smaller than any of the piles
            let pileCards = game.cardsInPlay[player.chosenPile].splice(0, 5, player.chosenCard);
            player.malusCards = player.malusCards.concat(pileCards);
            resolutionSteps.push({fromPile: player.chosenPile, toPlayer: playerIdx});
            resolutionSteps.push({fromPlayer: playerIdx, toPile: player.chosenPile});
        } else {
            // Regular play
            const destinationPile = destinationPileIdx(player.chosenCard, game.cardsInPlay);
            game.cardsInPlay[destinationPile].push(player.chosenCard);

            // Oh noes !
            if (game.cardsInPlay[destinationPile].length > 5) {
                player.malusCards = player.malusCards.concat(game.cardsInPlay[destinationPile].splice(0, 5));
                resolutionSteps.push({fromPile: destinationPile, toPlayer: playerIdx});
            }

            resolutionSteps.push({fromPlayer: playerIdx, toPile: destinationPile});
        }

        player.status = PlayerStatus.IDLE;
        player.chosenPile = null;
        player.chosenCard = null;
    });

    game.resolutionSteps = resolutionSteps;

    return updateGame(game);
}

function solveEnd(game) {
    const stillCardsToPlay = game.players.some(p => p.hand.length > 0),
        everyoneReadyForNextTurn = game.players.every(p => p.status === PlayerStatus.READY_FOR_NEXT_ROUND),
        endReached = isEndReached(game);

    if (game.status !== GameStatus.SOLVED || !everyoneReadyForNextTurn) {
        return Promise.resolve(game);
    } else if (stillCardsToPlay) {
        game.status = GameStatus.WAITING_FOR_CARDS;
        game.players = game.players.map(p => {
            p.status = PlayerStatus.CHOOSING_CARD;
            return p;
        });
        return updateGame(game);
    } else if (endReached) {
        game.status = GameStatus.ENDED;
        game.resolutionSteps = null;
        return updateGame(game);
    } else {
        return startRound(game.owner, game.id);
    }
}

function playAIs(game) {
    const aiActions = game.players
        .filter(p => p.AIEnabled)
        .map(p => {
            if (p.status === PlayerStatus.CHOOSING_CARD) {
                // Choose random card
                const randomCardValue = pickRandom(p.hand).value;
                return playCard(p.id, game.id, randomCardValue);
            } else if (p.status === PlayerStatus.HAS_TO_CHOOSE_PILE) {
                // Choose pile with lowest malus
                const smartestPileIdx = game.cardsInPlay
                    .map(computeTotalCardMalus)
                    .reduce((idx, malus, currentIdx, maluses) => {
                        if (idx === -1 || malus < maluses[idx]) {
                            return currentIdx;
                        }

                        return idx;
                    }, -1);

                return choosePile(p.id, game.id, smartestPileIdx);
            } else if (game.status === GameStatus.SOLVED) {
                return playerReady(p.id, game.id);
            }
        });

    return Promise.all(aiActions);
}

function isEndReached(game) {
    return game.players
        .map(p => computeTotalCardMalus(p.malusCards))
        .some(malus => malus >= game.maxMalus);
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

// Data helpers
function transformGameplayForPlayer(playerId, game, withResolutionSteps = false) {
    return Object.assign({}, game, {
        cardsInPlay: game.cardsInPlay.map(pile => pile.map(simpleCard)),
        resolutionSteps: withResolutionSteps ? game.resolutionSteps : null,
        players: game.players.map(player => {
            const shouldReturnFullPlayer = (player.id === playerId || game.status !== GameStatus.WAITING_FOR_CARDS);
            return shouldReturnFullPlayer ? fullPlayer(player) : otherPlayer(player);
        })
    });
}

function fullPlayer(player) {
    return Object.assign({}, player, {
        hand: player.hand.map(simpleCard),
        chosenCard: simpleCard(player.chosenCard),
        malusCards: player.malusCards.map(simpleCard),
        malus: computeTotalCardMalus(player.malusCards)
    });
}

function otherPlayer(player) {
    return {
        id: player.id,
        name: player.name,
        status: player.status,
        chosenCard: simpleCard(player.chosenCard ? {value: UNKNOWN_CARD_VALUE} : null),
        malus: computeTotalCardMalus(player.malusCards),
        AIEnabled: player.AIEnabled
    };
}

function simpleCard(card) {
    return card ? card.value : null;
}

function computeTotalCardMalus(cards) {
    return cards.reduce((sum, card) => sum + card.malus, 0);
}

function returnEmptyObject() {
    return {};
}


export default {
    startRound,

    playCard,
    cancelCard,
    choosePile,
    toggleAI,
    playerReady,

    resolveTurn,
    getGameplayForPlayer,
    transformGameplayForPlayer,
    listenToGameplayUpdates
};
