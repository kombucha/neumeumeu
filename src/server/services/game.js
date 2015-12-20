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
        avatarURL: player.avatarURL,
        hand: [],
        chosenCard: null,
        status: PlayerStatus.IDLE,
        malusCards: []
    };
}

function createGame(playerId, options) {
    const newGame = {
        name: options.name,
        password: options.password,
        maxMalus: options.maxMalus ? parseInt(options.maxMalus, 10) : 66,
        maxPlayers: options.maxPlayers ? parseInt(options.maxPlayers, 10) : 10,

        creationDate: r.now(),
        status: GameStatus.WAITING_FOR_PLAYERS,
        players: [],
        owner: playerId,
        cardsInPlay: [[], [], [], []]
    };

    return r.table('game')
        .insert(newGame)
        .run()
        .then(gameCreation => {
            const gameId = gameCreation['generated_keys'][0];
            return joinGame(playerId, gameId, options.password)
                .then(() => gameId);
        });
}

function joinGame(playerId, gameId, password = '') {
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
                }, {returnChanges: 'always'})
                .run()
                .then(result => {
                    if (result.unchanged !== 1) {
                        return {};
                    }

                    const game = result.changes[0]['new_val'];

                    if (game.status !== GameStatus.WAITING_FOR_PLAYERS) {
                        return Promise.reject('Can\'t join game: Already running');
                    } else if (game.password && game.password !== password) {
                        return Promise.reject('Can\'t join game: Wrong password');
                    } else if (game.players.length >= game.maxPlayers) {
                        return Promise.reject('Can\'t join game: Game is full');
                    } else if (game.players.filter(p => p.id === playerId) === 1) {
                        return {};
                    }

                    return Promise.reject('Can\'t join game: Unknown reason');
                });
        });
}

function getCurrentGames() {
    return r.table('game')
        .pluck(...simpleGameProjection)
        .filter(r.row('status').ne(GameStatus.ENDED))
        .orderBy(r.desc('creationDate'))
        .limit(10)
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
