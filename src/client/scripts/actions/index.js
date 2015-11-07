import * as api from 'client/api';

export function register(username) {
    return {
        type: 'REGISTER',
        username
    };
}

function updateGames(games) {
    return {
        type: 'UPDATE_GAMES',
        games
    };
}

export function fetchGames() {
    return dispatch => {
        return api.fetchGames()
            .then(games => dispatch(updateGames(games)));
    };
}
