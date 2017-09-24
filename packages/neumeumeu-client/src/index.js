import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import history from "./history";
import configureStore from "./store/configureStore";
import { configureSocket, bindSocketToStore } from "./remote";
import api from "./api";
import App from "./containers/App";
import { HomeContainer } from "./containers/Home";
import LoginContainer from "./containers/Login";
import { GameContainer } from "./containers/Game";
import { GameResultsContainer } from "./containers/GameResults";
import { GameCreationContainer } from "./containers/GameCreation";
import PrivateRoute from "./components/PrivateRoute";

import "normalize.css";
import "./index.css";

// STORE
const store = configureStore();
// SOCKET
const socket = configureSocket();

api.init(socket, store);
bindSocketToStore(socket, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Switch>
          <PrivateRoute
            path="/games/create"
            component={GameCreationContainer}
          />
          <PrivateRoute path="/games/:gameId" component={GameContainer} />
          <PrivateRoute
            path="/games/:gameId/results"
            component={GameResultsContainer}
          />
          <Route path="/login" component={LoginContainer} />
          <Route path="/" component={HomeContainer} />
        </Switch>
      </App>
    </Router>
  </Provider>,
  document.getElementById("root")
);
