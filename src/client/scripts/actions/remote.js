import api from 'client/api';
import {addErrorMessage} from './errors';

function updateRemoteStatus(connected) {
    return dispatch => {
        dispatch({
            type: 'UPDATE_REMOTE_STATUS',
            connected
        });

        if (!connected) {
            dispatch(addErrorMessage('Connection lost', 10000));
        }
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
