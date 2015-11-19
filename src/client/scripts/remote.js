import io from 'socket.io-client';
import {updateRemoteStatus} from 'client/actions';

function bindSocketToStore(socket, store) {
    socket.on('connect', () => store.dispatch(updateRemoteStatus(true)));
    socket.on('disconnect', () => store.dispatch(updateRemoteStatus(false)));
    socket.on('action', action => store.dispatch(action));
}

function configureSocket() {
    return io(`${location.protocol}//${location.hostname}:8090`);
}

export default {
    configureSocket,
    bindSocketToStore
};
