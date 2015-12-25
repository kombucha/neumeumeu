import {updatePath} from 'redux-simple-router';
import Errors from 'common/constants/errors';
import api from 'client/api';
import {joinRoom, leaveRoom} from './remote';
import {addErrorMessage} from './errors';

function updateCurrentGame(game) {
    return {
        type: 'UPDATE_CURRENT_GAME',
        game
    };
}

function clearCurrentGame() {
    return {
        type: 'CLEAR_CURRENT_GAME'
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

function playerReady(gameId) {
    return () => api.playerReady(gameId);
}

function joinGame(gameId, password) {
    return dispatch => {
        return api.joinGame(gameId, password)
            .then(game => {
                dispatch(updateCurrentGame(game));
                dispatch(joinRoom(gameId));
            })
            .catch((error) => {
                if (error === Errors.INVALID_TOKEN) {
                    return dispatch(updatePath('/register'));
                }

                dispatch(addErrorMessage(error));
            });
    };
}

function leaveGame(gameId) {
    return dispatch => {
        dispatch(leaveRoom(gameId));
        dispatch(clearCurrentGame());
    };
}

function applyResolutionStep(step) {
    return {
        type: 'APPLY_RESOLUTION_STEP',
        step
    };
}

export default {
    joinGame,
    leaveGame,
    playerReady,
    applyResolutionStep,

    startGame,
    playCard,
    cancelCard,
    choosePile
};
