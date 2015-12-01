
const noOpPromise = () => Promise.resolve({});

function init() {}

function login() {
    return Promise.resolve({
        user: {id: 0, name: 'kombu'},
        token: 'super-token'
    });
}

function createGame() {
    return Promise.resolve({});
}

function fetchGames() {
    return Promise.resolve([
        {
            id: 0,
            name: 'IWN',
            players: [],
            maxPlayers: 10,
            status: 'waiting_for_players',
            isProtected: false
        },
        {
            id: 1,
            name: 'VIP',
            players: [],
            maxPlayers: 4,
            status: 'waiting_for_players',
            isProtected: true
        }
    ]);
}

function getGame(gameId) {
    return Promise.resolve({
        id: gameId,
        name: 'IWN',
        cardsInPlay: [
            [
                {value: 60, malus: 3}
            ],
            [
                // {value: 19, malus: 1},
                // {value: 20, malus: 3},
                // {value: 21, malus: 1}
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
            {id:7, username: 'Gabriela', hand: []},
            {id:1, username: 'Azadeh', hand: []},
            {id:0, username: 'Vincent', hand: []},
            {id:3, username: 'Hugo', hand: []},
            {id:4, username: 'Samuel', hand: []},
            {id:5, username: 'Julian', hand: []},
            {id:6, username: 'Arnaud', hand: []}
        ],
        maxPlayers: 10,
        status: 'waiting_for_players',
        isProtected: false
    });
}

export default {
    init,

    login,
    logout: noOpPromise,
    register: noOpPromise,

    joinRoom: noOpPromise,
    leaveRoom: noOpPromise,

    createGame,
    fetchGames,
    getGame,
    joinGame: noOpPromise,

    startRound: noOpPromise
};
