import api from 'client/api';
import {joinRoom, leaveRoom} from 'client/actions/remote';
import {addErrorMessage} from 'client/actions/errors';
import {updatePath} from 'redux-simple-router';

function updateGames(games) {
    return {
        type: 'UPDATE_GAMES',
        games
    };
}

function createGame(game) {
    return dispatch => {
        return api.createGame(game)
            .then((gameId) => {
                dispatch(updatePath(`/games/${gameId}`));
            })
            .catch(err => dispatch(addErrorMessage(err)));
    };
}

function fetchGames() {
    return dispatch => {
        return api.fetchGames()
            .then(games => dispatch(updateGames(games)));
    };
}

function joinLobby() {
    return dispatch => {
        return api.fetchGames()
            .then(games => {
                dispatch(updateGames(games));
                dispatch(joinRoom('lobby'));
            });
    };
}

function leaveLobby() {
    return leaveRoom('lobby');
}

export default {
    createGame,
    fetchGames,
    joinLobby,
    leaveLobby
};
