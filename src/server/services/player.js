import r from 'server/database';

export function getPlayer(playerId) {
    return r.table('player').get(playerId)
        .run();
}

export default {
    getPlayer
};
