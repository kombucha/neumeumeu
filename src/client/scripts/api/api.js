let socket,
    store;

function init(_socket, _store) {
    socket = _socket;
    store = _store;
    window.socket = socket;
}

function getAuthToken() {
    return store.getState().authentication.token;
}

function emitAction(action) {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject('Api was not initialized');
        }

        socket.emit('action', action, (result) => {
            if (result.errors) {
                return reject(result.errors);
            }

            return resolve(result);
        });
    });
}

function login(username, password) {
    return emitAction({
        type: 'LOGIN',
        username,
        password
    });
}

function logout() {
    return emitAction({
        type: 'LOGOUT',
        token: getAuthToken()
    });
}

function register(newUser) {
    return emitAction({
        type: 'REGISTER',
        user: newUser
    });
}

function fetchCurrentGame(gameId) {
    return Promise.resolve({
        id: gameId,
        name: 'IWN',
        cardsInPlay: [
            [
                {value: 60, malus: 3}
            ],
            [
                {value: 19, malus: 1},
                {value: 20, malus: 3},
                {value: 21, malus: 1}
            ],
            [
                {value: 30, malus: 2},
                {value: 38, malus: 2}
            ],
            [
                {value: 40, malus: 2},
                {value: 41, malus: 1},
                {value: 42, malus: 1},
                {value: 43, malus: 1},
                {value: 44, malus: 5}
            ]
        ],
        currentHand: [
            {value: 55, malus: 7},
            {value: 10, malus: 3},
            {value: 104, malus: 1},
            {value: 22, malus: 5},
            {value: 78, malus: 1},
            {value: 1, malus: 1},
            {value: 24, malus: 1}
        ],
        players: [
            {username: 'Gabriela', card: {}},
            {username: 'Azadeh', card: {}},
            {username: 'Vincent', card: {}},
            {username: 'Hugo', card: {}},
            {username: 'Samuel', card: {}},
            {username: 'Julian'},
            {username: 'Arnaud', card: {}}
        ],
        maxPlayers: 10,
        status: 'playing',
        isProtected: false
    });
}

function fetchGames() {
    return emitAction({
        type: 'UPDATE_GAMES'
    });
}

function createGame(game) {
    return emitAction({
        type: 'CREATE_GAME',
        token: getAuthToken(),
        game
    });
}

function joinGame(id, password) {
    return emitAction({
        type: 'JOIN_GAME',
        token: getAuthToken(),
        id,
        password
    });
}

function joinRoom(id) {
    return emitAction({
        type: 'JOIN_ROOM',
        token: getAuthToken(),
        id
    });
}

function leaveRoom(id) {
    return emitAction({
        type: 'LEAVE_ROOM',
        token: getAuthToken(),
        id
    });
}

export default {
    init,

    login,
    logout,
    register,

    joinRoom,
    leaveRoom,

    createGame,
    fetchGames,
    fetchCurrentGame,
    joinGame
};
