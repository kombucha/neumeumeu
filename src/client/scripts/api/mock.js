
const noOpPromise = () => Promise.resolve({});

function init() {}

function login() {
    return Promise.resolve({
        player: {id: 0, name: 'kombu'},
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
            name: 'El chico',
            players: [],
            maxPlayers: 10,
            status: 'waiting_for_players',
            isProtected: false
        },
        {
            id: 1,
            name: 'Angels Room',
            players: [],
            maxPlayers: 4,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 2,
            name: 'Bigmac',
            players: [],
            maxPlayers: 6,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 3,
            name: 'Super room',
            players: [],
            maxPlayers: 8,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 4,
            name: 'Steevie Wonder',
            players: [],
            maxPlayers: 8,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 5,
            name: 'Pinocchio',
            players: [],
            maxPlayers: 10,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 6,
            name: 'My room',
            players: [],
            maxPlayers: 10,
            status: 'waiting_for_players',
            isProtected: true
        },
        {
            id: 7,
            name: 'A B C',
            players: [],
            maxPlayers: 5,
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
                60,
                3
            ],
            [
                // [19,1],
                // [20,3],
                // [21,1]
            ],
            [
                30,
                38
            ],
            [
                40,
                41,
                42,
                43,
                44
            ]
        ],

        players: [
            {id:7, username: 'Gabriela', hand: []},
            {id:1, username: 'Azadeh', hand: []},
            {
                id:0,
                username: 'Vincent',
                malus: 17,
                hand: [ 55, 10, 104, 22, 78, 1, 24 ]
            },
            {id:3, username: 'Hugo', hand: []},
            {id:4, username: 'Samuel', hand: []},
            {id:5, username: 'Julian', hand: []},
            {id:6, username: 'Arnaud', hand: []}
        ],
        maxPlayers: 10,
        status: 'waiting_for_cards',
        isProtected: false
    });
}

export default {
    init,

    login,
    logout: noOpPromise,
    register: noOpPromise,
    associateSocketToPlayer: noOpPromise,

    joinRoom: noOpPromise,
    leaveRoom: noOpPromise,

    createGame,
    fetchGames,
    getGame,
    joinGame: noOpPromise,

    startGame: noOpPromise,
    playCard: noOpPromise,
    cancelCard: noOpPromise,
    choosePile: noOpPromise,
    toggleAI: noOpPromise
};
