function login (state, token, player) {
    return {
        player,
        token
    };
}

function logout() {
    return DEFAULT_STATE;
}

const DEFAULT_STATE = {
    player: null,
    token: null
};

export default function users(state = DEFAULT_STATE, action) {
    switch (action.type) {
    case 'LOGIN':
        return login(state, action.token, action.user);
    case 'LOGOUT':
        return logout();
    }

    return state;
}
