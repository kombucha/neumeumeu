export default function users(state = false, action) {
    switch (action.type) {
    case 'UPDATE_REMOTE_STATUS':
        return action.connected;
    }

    return state;
}
