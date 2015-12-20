import api from 'client/api';

function fetchedCurrentGame(game) {
    return {
        type: 'UPDATE_CURRENT_GAME',
        game
    };
}

function startGame(gameId) {
    return () => api.startGame(gameId);
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

function toggleAI(gameId, playerId, enable) {
    return () => api.toggleAI(gameId, playerId, enable);
}

function playerReady(gameId) {
    return () => api.playerReady(gameId);
}

function updateCurrentGame(gameId) {
    return dispatch => {
        return api.getGame(gameId)
            .then(game => dispatch(fetchedCurrentGame(game)));
    };
}

function clearCurrentGame() {
    return {
        type: 'CLEAR_CURRENT_GAME'
    };
}

function applyResolutionStep(step) {
    return {
        type: 'APPLY_RESOLUTION_STEP',
        step
    };
}

export default {
    updateCurrentGame,
    clearCurrentGame,
    startGame,
    playCard,
    cancelCard,
    choosePile,
    toggleAI,
    playerReady,
    applyResolutionStep
};
