import * as api from 'client/api';

function fetchedGames(games) {
    return {
        type: 'FETCH_GAMES',
        games
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
