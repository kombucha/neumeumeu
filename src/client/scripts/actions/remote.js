import api from 'client/api';

function updateRemoteStatus(connected) {
    return {
        type: 'UPDATE_REMOTE_STATUS',
        connected
    };
}

function joinRoom(id) {
    return dispatch => {
        return api.joinRoom(id)
            .then(() => dispatch({
                type: 'JOIN_ROOM',
                id
            }));
    };
}

function leaveRoom(id) {
    return dispatch => {
        return api.leaveRoom(id)
            .then(() => dispatch({
                type: 'LEAVE_ROOM',
                id
            }));
    };
}

export default {
    updateRemoteStatus,
    joinRoom,
    leaveRoom
};
