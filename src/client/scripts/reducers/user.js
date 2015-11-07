function register(state, username) {
    return {
        ...state,
        currentUsername: username
    };
}

export default function users(state = {}, action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    }

    return state;
}
