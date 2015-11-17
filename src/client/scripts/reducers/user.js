function register(state, username) {
    return {
        ...state,
        currentUsername: username
    };
}

const DEFAULT_STATE = {
    authenticated: (process.env.NODE_ENV === 'development')
};

export default function users(state = DEFAULT_STATE, action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    }

    return state;
}
