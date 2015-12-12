import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {Provider} from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {syncReduxAndRouter} from 'redux-simple-router';

import configureStore from 'client/store/configureStore';
import {configureSocket, bindSocketToStore} from 'client/remote';
import auth from 'client/auth';
import api from 'client/api';
import App from 'client/containers/App';
import {HomeContainer} from 'client/containers/Home';
import {RegisterContainer} from 'client/containers/Register';
import {GameContainer} from 'client/containers/Game';
import {GameResultsContainer} from 'client/containers/GameResults';
import {GameCreationContainer} from 'client/containers/GameCreation';

// STORE
const store = configureStore();


// SOCKET
const socket = configureSocket();
api.init(socket, store);
bindSocketToStore(socket, store);

// AUTHENTICATION
const requireAuth = auth(store);

// ROUTING
const ROUTES = (
        <Route component={App}>
            <Route path="/" component={HomeContainer} />
            <Route path="/register" component={RegisterContainer} />
            <Route path="/games/create" component={GameCreationContainer} onEnter={requireAuth}/>
            <Route path="/games/:gameId" component={GameContainer} onEnter={requireAuth}/>
            <Route path="/games/:gameId/results" component={GameResultsContainer}/>
        </Route>
    ),
    history = createBrowserHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {ROUTES}
        </Router>
    </Provider>,
    document.getElementById('app-container'));
