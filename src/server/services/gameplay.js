import {generateGameCards} from 'common/deck';

export default function startRound(gameId) {
    const gameCards = generateGameCards();

    return r.table('game')
        .get(gameId)
        .update({
            status: 'waiting_for_cards',
            cardsInPlay: gameCards.cardsInPlay,
            players: game('players').map(gameCards.hands, (player, hand) => player.merge({hand}))
        })
        .run()
        .then(() => startRound());
}

export default function playCard(playerId, gameId, cardId) {
    // TODO
    return false;
}

export default function choosePile(playerId, gameId, columnIdx) {
    // TODO
    return false;
}
