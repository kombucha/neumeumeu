// TODO: Split actions
import * as api from 'client/api';

function fetchedGames(games) {
    return {
        type: 'FETCH_GAMES',
        games
    };
}

function fetchedCurrentGame(game) {
    return {
        type: 'FETCH_CURRENT_GAME',
        game
    };
}

function joinedGame(userId, gameId) {
    return {
        type: 'JOIN_GAME',
        userId,
        gameId
    };
}

// Public actions
// TODO: handle error (action_name_FAIL) ?
// TODO: handle optimistic update (action_name_PENDING) ?
export function register(username) {
    return {
        type: 'REGISTER',
        username
    };
}

export function joinGame(userId, gameId, password) {
    return dispatch => {
        return api.joinGame(userId, gameId, password)
            .then(() => dispatch(joinedGame(userId, gameId)));
    };
}

export function fetchGames() {
    return dispatch => {
        return api.fetchGames()
            .then(games => dispatch(fetchedGames(games)));
    };
}

export function fetchCurrentGame(gameId) {
    return dispatch => {
        return api.fetchCurrentGame(gameId)
            .then(game => dispatch(fetchedCurrentGame(game)));
    };
}

export function playCard(card) {
    return {
        type: 'PLAY_CARD',
        card,
        meta: {
            remote: true
        }
    };
}

export function updateRemoteStatus(connected) {
    return {
        type: 'UPDATE_REMOTE_STATUS',
        connected
    };
}
