
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
                19,
                20,
                21
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
            {id:7, name: 'Gabriela', hand: [], malus: 20},
            {id:1, name: 'Azadeh', hand: [], malus: 22},
            {
                id: 0,
                name: 'Vincent',
                status: 'choosing_card',
                //status: 'choosing_pile',
                malus: 17,
                chosenCard: 11,
                hand: [ 55, 10, 104, 22, 78, 1, 24 ]
            },
            {id:3, name: 'Hugo', hand: [], malus: 2},
            {id:4, name: 'Samuel', hand: [], malus: 40},
            {id:5, name: 'Julian', hand: [], malus: 200},
            {id:6, name: 'Arnaud', hand: [], malus: 4}
        ],
        maxPlayers: 10,
        owner: 0,
        //status: 'waiting_for_players',
        //status: 'waiting_for_cards',
        status: 'waiting_for_pile_choice',
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
