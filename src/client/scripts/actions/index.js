// TODO: Split actions
// TODO: Move "simple actions" (no thunk) to common/actions
import {updatePath} from 'redux-simple-router';
import * as api from 'client/api';

function fetchedCurrentGame(game) {
    return {
        type: 'FETCH_CURRENT_GAME',
        game
    };
}

function updateGames(games) {
    return {
        type: 'UPDATE_GAMES',
        games
    };
}

// Public actions
function register(username) {
    return {
        type: 'REGISTER',
        username
    };
}

function logout() {
    return {
        type: 'LOGOUT'
    };
}

function createGame(game) {
    return dispatch => {
        return api.createGame(game)
            .then(() => {
                dispatch(updatePath('/'));
            });
    };
}

function fetchGames() {
    return dispatch => {
        return api.fetchGames()
            .then(games => dispatch(updateGames(games)));
    };
}

function fetchCurrentGame(gameId) {
    return dispatch => {
        return api.fetchCurrentGame(gameId)
            .then(game => dispatch(fetchedCurrentGame(game)));
    };
}

function playCard(card) {
    return {
        type: 'PLAY_CARD',
        card,
        meta: {
            remote: true
        }
    };
}

function updateRemoteStatus(connected) {
    return {
        type: 'UPDATE_REMOTE_STATUS',
        connected
    };
}

export default {
    register,
    logout,
    createGame,
    fetchGames,
    fetchCurrentGame,
    playCard,
    updateRemoteStatus
};
