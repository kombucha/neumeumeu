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

function playCard(gameId, cardValue) {
    return () => api.playCard(gameId, cardValue);
}

function cancelCard(gameId) {
    return () => api.cancelCard(gameId);
}

function choosePile(gameId, pile) {
    return () => api.choosePile(gameId, pile);
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

function clearCurrentGame() {
    return {
        type: 'CLEAR_CURRENT_GAME'
    };
}

export default {
    updateCurrentGame,
    clearCurrentGame,
    startGame,
    playCard,
    cancelCard,
    choosePile
};
