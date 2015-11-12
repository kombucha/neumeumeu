import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {middleware as remoteMiddleware} from 'client/remote';
import {routeReducer} from 'redux-simple-router';
import reducers from 'client/reducers';

export default function configureStore(initialState, socket) {
    const combinedReducers = combineReducers({
        ...reducers,
        routing: routeReducer
    });

    let middlewares = [thunkMiddleware, remoteMiddleware(socket)];

    if (process.env.NODE_ENV !== 'production') {
        middlewares = [require('redux-immutable-state-invariant')(), ...middlewares];
    }

    const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

    return createStoreWithMiddleware(combinedReducers, initialState);
}
