import r from 'server/database';
import {getPlayer} from 'server/services/player';

function simpleGame(game) {
    return {
        id: game.id,
        name: game.name,
        players: game.players.map(p => ({
            id: p.id,
            name: p.name
        })),
        maxPlayers: game.maxPlayers,
        isProtected: !!game.password
    };
}

export function createGame(options) {
    // TODO: cleanup game options
    return r.table('game').insert(options).run();
}

export function joinGame(playerId, gameId, password = '') {
    // Atomic conditional update
    // https://www.rethinkdb.com/docs/cookbook/javascript/#atomically-updating-a-document-based-on-a-condition
    return getPlayer(playerId)
        .then(player => {
            return r.table('game')
                .get(gameId)
                .update(game => {
                    return r.branch(
                            // Status OK
                            game('status').eq('waiting_for_players')
                            // AND password OK
                            .and(game('password').default('').eq(password))
                            // AND not already joined
                            .and(r.not(game('players').contains(player => player('id').eq(playerId)))
                        ),
                        // TODO: prepare player data as a game-player (with status and stuff)
                        {players: game('players').append(player)},
                        {}
                    );
                });
        });
        // TODO: reject promise if result.replaced !== 1
}

export function getGame(gameId) {
    return r.table('game').get(gameId).run();
}

export function getCurrentGames() {
    return r.table('game').run()
        .then(games => games.map(simpleGame));
}

export function startGame(playerID, gameId) {
    // TODO: generate cards (maybe delegate this to startRound() ?)
    return r.table('game')
        .get(gameId)
        .update(game => {
            return r.branch(
                game('owner')('id').eq(playerID),
                {status: 'started'},
                {}
            );
        })
        .run();
}
