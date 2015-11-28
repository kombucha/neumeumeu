// TODO: Split actions
// TODO: Move "simple actions" (no thunk) to common/actions
import authentication from './authentication';
import game from './game';

function playCard(card) {
    return {
        type: 'PLAY_CARD',
        card,
        meta: {
            remote: true
        }
    };
}

function updateRemoteStatus(connected) {
    return {
        type: 'UPDATE_REMOTE_STATUS',
        connected
    };
}

export default Object.assign({},
    authentication,
    game, {
        playCard,
        updateRemoteStatus
    }
);
