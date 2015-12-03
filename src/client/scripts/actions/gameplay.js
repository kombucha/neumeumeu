import api from 'client/api';

function fetchedCurrentGame(game) {
    return {
        type: 'UPDATE_CURRENT_GAME',
        game
    };
}

function startedGame() {
    return {
        type: 'START_GAME'
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

function startGame(gameId) {
    return dispatch => api.startGame(gameId)
        .then(() => dispatch(startedGame()));
}

export default {
    updateCurrentGame,
    startGame,
    playCard
};
