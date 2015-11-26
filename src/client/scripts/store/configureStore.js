import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routeReducer} from 'redux-simple-router';
import reducers from 'client/reducers';

export default function configureStore(initialState) {
    const combinedReducers = combineReducers(Object.assign({},
        reducers,
        {routing: routeReducer}
    ));

    let middlewares = [thunkMiddleware];

    if (process.env.NODE_ENV !== 'production') {
        middlewares = [require('redux-immutable-state-invariant')(), ...middlewares];
    }

    const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

    return createStoreWithMiddleware(combinedReducers, initialState);
}
