import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import persistState from "redux-localstorage";
import reducers from "../reducers";
import gameInflaterMiddleware from "../middlewares/gameInflater";

export default function configureStore(initialState) {
  const combinedReducers = combineReducers(Object.assign({}, reducers));

  let middlewares = [thunkMiddleware, gameInflaterMiddleware];

  let storeEnhancers = [
    persistState("authentication", { key: "neumeumeu-auth" }),
  ];

  if (process.env.NODE_ENV !== "production") {
    const immutableMiddleware = require("redux-immutable-state-invariant")
      .default;
    const loggerMiddleware = require("redux-logger").createLogger;
    middlewares = [
      immutableMiddleware(),
      ...middlewares,
      loggerMiddleware({ collapsed: true }),
    ];
  }

  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    ...storeEnhancers
  )(createStore);

  return finalCreateStore(combinedReducers, initialState);
}
