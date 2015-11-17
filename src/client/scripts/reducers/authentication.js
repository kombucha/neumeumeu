function register(state, username) {
    return {
        ...state,
        currentUsername: username
    };
}

function logout() {
    return DEFAULT_STATE;
}

const DEFAULT_STATE = {
    token: (process.env.NODE_ENV === 'development') ? 'DUMMY_TOKEN' : null
};

export default function users(state = DEFAULT_STATE, action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    case 'LOGOUT':
        return logout();
    }

    return state;
}
