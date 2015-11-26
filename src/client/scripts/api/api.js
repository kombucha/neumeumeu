let socket,
    store;

function init(_socket, _store) {
    socket = _socket;
    store = _store;
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
            {username: 'Gabriela'},
            {username: 'Azadeh'},
            {username: 'Vincent'},
            {username: 'Hugo'},
            {username: 'Samuel'},
            {username: 'Julian'},
            {username: 'Arnaud'}
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
        game
    });
}

export default {
    init,
    login,
    register,
    createGame,
    fetchGames,
    fetchCurrentGame
};
