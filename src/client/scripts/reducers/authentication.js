function register(state, username) {
    return Object.assign({}, state, {
        currentUsername: username
    });
}

function login (state, token, user) {
    return {
        user,
        token
    };
}

function logout() {
    return DEFAULT_STATE;
}

const DEFAULT_STATE = {
    user: null,
    token: null
};

export default function users(state = DEFAULT_STATE, action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    case 'LOGIN':
        return login(state, action.token, action.user);
    case 'LOGOUT':
        return logout();
    }

    return state;
}
