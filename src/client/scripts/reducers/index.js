import {Map, fromJS} from 'immutable';

function register(state, username) {
    return state.set('currentUsername', username);
}

function updateGames(state, games) {
    return state.set('games', fromJS(games));
}

export default function(state = Map(), action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    case 'UPDATE_GAMES':
        return updateGames(state, action.games);
    }

    return state;
}
