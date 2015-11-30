const DEFAULT_STATE = {
    connected: false,
    rooms: new Set()
};

function updateRemoteStatus(state, connected) {
    return Object.assign({}, state, {
        connected
    });
}

function joinRoom(state, id) {
    return Object.assign({}, state, {
        rooms: new Set(state.rooms.add(id))
    });
}

function leaveRoom(state, id) {
    const newRooms = new Set(state.rooms);
    newRooms.delete(id);
    return Object.assign({}, state, {
        rooms: newRooms
    });
}

export default function remote(state = DEFAULT_STATE, action) {
    switch (action.type) {
    case 'UPDATE_REMOTE_STATUS':
        return updateRemoteStatus(state, action.connected);
    case 'JOIN_ROOM':
        return joinRoom(state, action.id);
    case 'LEAVE_ROOM':
        return leaveRoom(state, action.id);
    }

    return state;
}
