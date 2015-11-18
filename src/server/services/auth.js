import crypto from 'crypto';
import r from 'server/database';

const pbkdf2 = promisify(crypto.pbkdf2);

function getUserFromToken(token) {
    if (!token) {
        return Promise.resolve(null);
    }

    return r.table('player')
        .filter(player => player('tokens').contains(token))
        .limit(1)
        .run();
}

function login(username, password) {
    return r.table('player')
        .filter(player => player('name').eq(username))
        .limit(1)
        .run()
        .then(player => {
            var passwordOk = checkPassword(password, player.salt, player.password);

            if (passwordOk) {
                return createTokenForPlayer(player.id);
            }

            return Promise.reject(null);
        });
}

function logout(token) {
    return r.table('player')
        .update({tokens: r.row('tokens').difference([token])})
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

function randomHexString() {
    return crypto.randomBytes(48).toString('hex');
}

function generateToken() {
    // TODO: something better
    return randomHexString();
}

function checkPassword(password, salt, hashedPassword) {
    const checkedPassword = hashAndSaltPassword(password, salt);
    return checkedPassword === hashedPassword;
}

function hashAndSaltPassword(password, salt) {
    return pbkdf2(password, salt, 4096, 64)
        .then(buffer => buffer.toString('hex'));
}

// TODO: Extract to utils when used elsewhere
function promisify(fn) {
    return (...args) => new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
}
