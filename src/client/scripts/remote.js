import io from 'socket.io-client';
import {updateRemoteStatus, joinRoom} from 'client/actions';

function bindSocketToStore(socket, store) {
    socket.on('connect', () => store.dispatch(updateRemoteStatus(true)));
    socket.on('reconnect', () => {
        // Restore rooms on reconnect
        const rooms = store.getState().remote.rooms;
        rooms.forEach(room => store.dispatch(joinRoom(room)));
    });
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
