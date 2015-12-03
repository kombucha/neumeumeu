import r from 'server/database';

function getPlayer(playerId) {
    return r.table('player').get(playerId).run();
}

export default {
    getPlayer
};
