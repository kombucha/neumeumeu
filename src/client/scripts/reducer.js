import {Map} from 'immutable';

function register(state, username) {
    return state.set('currentUsername', username);
}

export default function(state = Map(), action) {
    switch (action.type) {
    case 'REGISTER':
        return register(state, action.username);
    }

    return state;
}
