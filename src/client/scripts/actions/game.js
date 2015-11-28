import api from 'client/api';
import {updatePath} from 'redux-simple-router';

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

function createGame(game) {
    return dispatch => {
        return api.createGame(game)
            .then(() => {
                dispatch(updatePath('/'));
            });
    };
}

function joinGame(gameId) {
    return {
        type: 'JOIN_GAME',
        id: gameId
    };
}

function spectateGame(gameId) {
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

function fetchCurrentGame(gameId) {
    return dispatch => {
        return api.fetchCurrentGame(gameId)
            .then(game => dispatch(fetchedCurrentGame(game)));
    };
}

export default {
    createGame,
    fetchGames,
    fetchCurrentGame,
    joinGame,
    spectateGame
};
