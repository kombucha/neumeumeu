export function fetchCurrentGame(gameId) {
    return Promise.resolve({
        id: gameId,
        name: 'IWN',
        cardsInPlay: [
            [
                {value: 10, malus: 2}
            ],
            [
                {value: 20, malus: 2}
            ],
            [
                {value: 30, malus: 2}
            ],
            [
                {value: 40, malus: 2}
            ]
        ],
        currentHand: [
            {value: 55, malus: 7},
            {value: 11, malus: 3},
            {value: 104, malus: 1}
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
