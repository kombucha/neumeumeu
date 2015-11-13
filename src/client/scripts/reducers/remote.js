export default function users(state = false, action) {
    switch (action.type) {
    case 'REMOTE_CONNECTED':
        return action.connected;
    }

    return state;
}
