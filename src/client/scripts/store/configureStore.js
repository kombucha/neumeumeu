import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'client/reducers';

let middlewares = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
    middlewares = [require('redux-immutable-state-invariant')(), ...middlewares];
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}
