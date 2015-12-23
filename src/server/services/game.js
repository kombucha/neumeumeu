import r from 'server/database';
import {getPlayer} from 'server/services/player';
import {range} from 'common/utils';
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
        malusCards: [],
        AIEnabled: !!player.AIEnabled
    };
}

function createBot() {
    return createGamePlayer({
        id: r.uuid(),
        name: 'Bob', // TODO: generate random funny name :)
        avatarURL: undefined, // TODO: robot avatar
        AIEnabled: true
    });
}

function createGame(playerId, options) {
    const maxMalus = isNaN(options.maxMalus) ? 66 : parseInt(options.maxMalus, 10),
        maxPlayers = isNaN(options.maxPlayers) ? 10 : parseInt(options.maxPlayers, 10),
        botsCount = isNaN(options.botsCount) ? 0 : Math.min(maxPlayers, parseInt(options.botsCount, 10)),
        newGame = {
            name: options.name,
            password: options.password,
            maxMalus,
            maxPlayers,

            creationDate: r.now(),
            status: GameStatus.WAITING_FOR_PLAYERS,
            players: range(Math.max(0, botsCount)).map(createBot),
            owner: playerId,
            cardsInPlay: [[], [], [], []]
        };

    return getPlayer(playerId)
        .then(player => {
            newGame.players = [createGamePlayer(player), ...newGame.players];
            return r.table('game')
                .insert(newGame)
                .run();
        })
        .then(result => result['generated_keys'][0]);
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
        .filter(r.row('status').ne(GameStatus.ENDED))
        .orderBy(r.desc('creationDate'))
        .pluck(...simpleGameProjection)
        .limit(10)
        .run();
}

function onLobbyUpdate(cb) {
    return r.table('game')
        .filter(r.row('status').ne(GameStatus.ENDED))
        .pluck(...simpleGameProjection)
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
