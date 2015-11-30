import r from 'server/database';
import {getPlayer} from 'server/services/player';
import {startRound} from 'server/services/gameplay';

function simpleGame(game) {
    return {
        id: game.id,
        name: game.name,
        players: Object.keys(game.players).map(playerId => ({
            id: playerId,
            name: game.players[playerId].name
        })),
        status: game.status,
        maxPlayers: game.maxPlayers,
        isProtected: !!game.password
    };
}

function fullGame(game) {
    return {
        id: game.id,
        name: game.name,
        players: Object.keys(game.players).map(playerId => {
            const player = game.players[playerId];
            return {
                id: playerId,
                name: player.name,
                status: player.status,
                hand: player.hand,
                playedCard: player.playedCard,
                malus: player.malus || 0
            };
        }),
        cardsInPlay: game.cardsInPlay,
        owner: game.owner,
        status: game.status,
        maxPlayers: game.maxPlayers
    };
}

function createGamePlayer(player) {
    return {
        id: player.id,
        name: player.name,
        hand: [],
        chosenCard: null,
        status: 'idle',
        malus: 0
    };
}

function createGame(playerId, options) {
    // TODO: cleanup game options
    const newGame = Object.assign({}, options, {
        status:  'waiting_for_players',
        players: {},
        owner: playerId,
        cardsInPlay: [[], [], [], []]
    });
    return r.table('game').insert(newGame).run();
}

function joinGame(playerId, gameId, password = '') {
    // Atomic conditional update
    // https://www.rethinkdb.com/docs/cookbook/javascript/#atomically-updating-a-document-based-on-a-condition
    return getPlayer(playerId)
        .then(player => {
            const gamePlayer = createGamePlayer(player);

            return r.table('game')
                .get(gameId)
                .update(game => {
                    return r.branch(
                        // Status OK
                        game('status').eq('waiting_for_players')
                        // AND password OK
                        .and(game('password').default('').eq(password))
                        // AND not already at max capacity
                        .and(game('players').keys().count().lt(game('maxPlayers'))),
                        {players: game('players').merge(r.object(player.id, gamePlayer))},
                        {}
                    );
                })
                .run();
        });
        // TODO: Reject promise if result.replaced !== 1 (?) or errors.length !== 0
}

function getGame(gameId) {
    return r.table('game')
        .get(gameId)
        .run()
        .then(fullGame);
}

function getCurrentGames() {
    return r.table('game').run()
        .then(games => games.map(simpleGame));
}

function startGame(playerID, gameId) {
    return r.table('game')
        .get(gameId)
        .update(game => {
            return r.branch(
                game('owner')('id').eq(playerID),
                {status: 'started'},
                {}
            );
        })
        .run()
        .then(() => startRound());
}

export default {
    createGame,
    joinGame,
    getGame,
    getCurrentGames,
    startGame
};
