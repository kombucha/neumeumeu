import io from 'socket.io-client';
import {updateRemoteStatus} from 'client/actions';

export const middleware =  socket => (/* store */) => next => action => {
    if (action.meta && action.meta.remote) {
        socket.emit('action', {socketId: socket.io.engine.id, action: action});
    }
    return next(action);
};

export function bindSocketToStore(socket, store) {
    socket.on('connect', () => store.dispatch(updateRemoteStatus(true)));
    socket.on('disconnect', () => store.dispatch(updateRemoteStatus(false)));
    socket.on('action', action => store.dispatch(action));
}

export function configureSocket() {
    return io(`${location.protocol}//${location.hostname}:8090`);
}
