export function fetchGames() {
    return Promise.resolve([
        {
            id: 0,
            name: 'IWN',
            players: [],
            status: 'waiting_for_players'
        }
    ]);
}
