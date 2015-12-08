import crypto from 'crypto';
import r from 'server/database';
import Errors from 'common/constants/errors';
import {promisify} from 'common/utils';

const pbkdf2 = promisify(crypto.pbkdf2);

function getPlayerFromToken(token) {
    if (!token) {
        return Promise.reject(Errors.INVALID_TOKEN);
    }

    return r.table('player')
        .filter(player => player('tokens').contains(token))
        .limit(1)
        .run()
        .then(players => {
            if (players.length !== 1) {
                return Promise.reject(Errors.INVALID_TOKEN);
            }

            return players[0];
        });
}

function getPlayerFromSocket(socketId) {
    return r.table('player')
        .filter(player => player('sockets').contains(socketId))
        .run()
        .then(players => players[0]);
}

function simplePlayer(player) {
    return {
        id: player.id,
        name: player.name
    };
}

function login(username, password) {
    const genericError = {
        errors: ['Invalid username or password']
    };

    return r.table('player')
        .filter(player => player('name').eq(username))
        .limit(1)
        .run()
        .then(players => {
            const player = players[0];

            if (!player) {
                return Promise.reject(genericError);
            }

            return Promise.all([
                player,
                checkPassword(password, player.salt, player.password)
            ]);
        })
        .then(([player, isPasswordOk]) => {
            if (!isPasswordOk) {
                return Promise.reject(genericError);
            }

            return Promise.all([
                simplePlayer(player),
                createTokenForPlayer(player.id)
            ]);
        })
        .then(([player, token]) => {
            return {
                player,
                token
            };
        });
}

function register(newPlayer) {
    return isNameAvailable(newPlayer.username)
        .then((available) => {
            if (!available) {
                return Promise.reject({
                    errors:[`Username ${newPlayer.username} is already taken !`]
                });
            }

            const salt = randomHexString();

            return Promise.all([
                Promise.resolve(salt),
                hashAndSaltPassword(newPlayer.password, salt)
            ]);
        })
        .then(([salt, hashedPassword]) => {
            return r.table('player')
                .insert({
                    name: newPlayer.username,
                    email: newPlayer.email,
                    password: hashedPassword,
                    salt,
                    tokens: []
                })
                .run();
        })
        // Not really efficient...
        .then(() => login(newPlayer.username, newPlayer.password));
}

function logout(token) {
    return r.table('player')
        .update({tokens: r.row('tokens').difference([token])})
        .run();
}

function associateWithSocket(playerId, socketId) {
    return r.table('player')
        .get(playerId)
        .update({
            sockets: r.row('sockets').default([]).setInsert(socketId)
        })
        .run();
}

function dissociateFromSocket(socketId) {
    return r.table('player')
        .update({
            sockets: r.row('sockets').default([]).setDifference([socketId])
        })
        .run();
}

function createTokenForPlayer(playerId) {
    const token = generateToken();
    return r.table('player')
        .get(playerId)
        .update({
            tokens: r.row('tokens').append(token)
        })
        .run()
        .then(() => token);
}

function isNameAvailable(name) {
    return r.table('player')
        .filter({name}).count()
        .run()
        .then(count => count === 0);
}

function randomHexString() {
    return crypto.randomBytes(48).toString('hex');
}

function generateToken() {
    // TODO: something better
    return randomHexString();
}

function checkPassword(password, salt, hashedPassword) {
    return hashAndSaltPassword(password, salt)
        .then(checkedPassword => (checkedPassword === hashedPassword));
}

function hashAndSaltPassword(password, salt) {
    return pbkdf2(password, salt, 4096, 64)
        .then(buffer => buffer.toString('hex'));
}

export default {
    getPlayerFromToken,
    getPlayerFromSocket,
    register,
    login,
    logout,
    associateWithSocket,
    dissociateFromSocket
};
