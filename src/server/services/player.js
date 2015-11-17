import r from 'server/database';

export function getPlayer(playerId) {
    return r.table('player').get(playerId).run();
}

export function register() {
    // TODO
}

export function isNameAvailable(name) {
    return r.table('player')
        .filter({name}).count()
        .run()
        .then(count => count === 0);
}

export function logout() {
    // TODO
}
