import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { routeReducer } from "redux-simple-router";
import persistState from "redux-localstorage";
import reducers from "client/reducers";
import gameInflaterMiddleware from "client/middlewares/gameInflater";

export default function configureStore(initialState) {
  const combinedReducers = combineReducers(
    Object.assign({}, reducers, { routing: routeReducer })
  );

  let middlewares = [thunkMiddleware, gameInflaterMiddleware];

  let storeEnhancers = [
    persistState("authentication", { key: "card-game-auth" }),
  ];

  if (process.env.NODE_ENV !== "production") {
    middlewares = [
      require("redux-immutable-state-invariant")(),
      ...middlewares,
      require("redux-logger")({ collapsed: true }),
    ];
  }

  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    ...storeEnhancers
  )(createStore);

  return finalCreateStore(combinedReducers, initialState);
}
