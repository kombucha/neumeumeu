function register(state, username) {
    return {
        ...state,
        currentUsername: username
    };
}

function updateGames(state, games) {
    return {
        ...state,
        games
    };
}

export default function(state = {}, action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    case 'FETCH_GAMES':
        return updateGames(state, action.games);
    }

    return state;
}
