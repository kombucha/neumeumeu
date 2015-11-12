export function fetchCurrentGame(gameId) {
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
            {username: 'Arnaud'}
        ],
        maxPlayers: 10,
        status: 'playing',
        isProtected: false
    });
}

export function fetchGames() {
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

export function joinGame(userId, gameId, password) { // eslint-disable-line no-unused-vars
    return Promise.resolve({
        id: gameId
    });
}
