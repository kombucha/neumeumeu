import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routeReducer} from 'redux-simple-router';
import reducers from 'client/reducers';

export default function configureStore(initialState) {
    const combinedReducers = combineReducers(Object.assign({},
        reducers,
        {routing: routeReducer}
    ));

    let middlewares = [thunkMiddleware],
        storeEnhancers = [];

    if (process.env.NODE_ENV !== 'production') {
        middlewares = [require('redux-immutable-state-invariant')(), ...middlewares];
        storeEnhancers = [...storeEnhancers, require('client/containers/DevTools').instrument()];
    }

    const finalCreateStore = compose(
            applyMiddleware(...middlewares),
            ...storeEnhancers
        )(createStore);

    return finalCreateStore(combinedReducers, initialState);
}
