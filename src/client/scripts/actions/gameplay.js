import api from 'client/api';

function fetchedCurrentGame(game) {
    return {
        type: 'UPDATE_CURRENT_GAME',
        game
    };
}

function startedRound() {
    return {
        type: 'START_ROUND'
    };
}

function playCard(card) {
    return {
        type: 'PLAY_CARD',
        card
    };
}

function updateCurrentGame(gameId) {
    return dispatch => {
        return api.getGame(gameId)
            .then(game => dispatch(fetchedCurrentGame(game)));
    };
}

function startRound(gameId) {
    return dispatch => api.startRound(gameId)
        .then(() => dispatch(startedRound()));
}

export default {
    updateCurrentGame,
    startRound,
    playCard
};
