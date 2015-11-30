import api from 'client/api';
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
            .then(() => {
                dispatch(updatePath('/'));
            });
    };
}

function joinGame(gameId, password) {
    return dispatch => {
        return api.joinGame(gameId, password)
            .then(() => {
                return dispatch(updatePath(`/games/${gameId}`));
            });
    };
}

function spectateGame(gameId) {
    // TODO
    return {
        type: 'SPECTATE_GAME',
        id: gameId
    };
}

function fetchGames() {
    return dispatch => {
        return api.fetchGames()
            .then(games => dispatch(updateGames(games)));
    };
}

export default {
    createGame,
    fetchGames,
    joinGame,
    spectateGame
};
