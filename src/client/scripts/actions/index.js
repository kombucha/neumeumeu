// TODO: Split actions
import * as api from 'client/api';

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

export function createGame(game) {
    return {
        type: 'CREATE_GAME',
        meta: {remote: true},
        game
    };
}

export function joinGame(userId, gameId, password) {
    return dispatch => {
        return api.joinGame(userId, gameId, password)
            .then(() => dispatch(joinedGame(userId, gameId)));
    };
}

export function fetchGames() {
    return {
        type: 'UPDATE_GAMES',
        meta: {remote: true}
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
