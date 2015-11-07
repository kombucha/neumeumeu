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
