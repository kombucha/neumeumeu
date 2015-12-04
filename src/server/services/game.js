import r from 'server/database';
import {getPlayer} from 'server/services/player';
import PlayerStatus from 'common/constants/player-status';
import GameStatus from 'common/constants/game-status';

const simpleGameProjection = [
    'id', 'isProtected', 'maxPlayers', 'status', 'name',
    {'players': ['id', 'name']}
];

function createGamePlayer(player) {
    return {
        id: player.id,
        name: player.name,
        hand: [],
        chosenCard: null,
        status: PlayerStatus.IDLE,
        malus: 0
    };
}

function createGame(playerId, options) {
    // TODO: cleanup game options
    const newGame = Object.assign({}, options, {
        status: GameStatus.WAITING_FOR_PLAYERS,
        players: [],
        owner: playerId,
        cardsInPlay: [[], [], [], []]
    });
    return r.table('game')
        .insert(newGame)
        .run()
        .then(gameCreation => gameCreation['generated_keys'][0]);
}

function joinGame(playerId, gameId, password = '') {
    // TODO: Reject promise if result.replaced !== 1 (?) or errors.length !== 0
    return getPlayer(playerId)
        .then(player => {
            const gamePlayer = createGamePlayer(player);

            return r.table('game')
                .get(gameId)
                .update(game => {
                    return r.branch(
                        // Status OK
                        game('status').eq(GameStatus.WAITING_FOR_PLAYERS)
                        // AND password OK
                        .and(game('password').default('').eq(password))
                        // AND not already joined
                        .and(game('players').filter({id: playerId}).count().eq(0))
                        // AND not already at max capacity
                        .and(game('players').count().lt(game('maxPlayers'))),
                        {players: game('players').append(gamePlayer)},
                        {}
                    );
                })
                .run();
        });
}

function getCurrentGames() {
    return r.table('game')
        .pluck(...simpleGameProjection)
        .filter(r.row('status').ne(GameStatus.ENDED))
        .run();
}

function onLobbyUpdate(cb) {
    return r.table('game')
        .pluck(...simpleGameProjection)
        .filter(r.row('status').ne(GameStatus.ENDED))
        .changes()
        .run()
        .then(cursor => {
            cursor.on('data', () => {
                return getCurrentGames().then(cb);
            });
        });
}

export default {
    createGame,
    joinGame,
    getCurrentGames,
    onLobbyUpdate
};
