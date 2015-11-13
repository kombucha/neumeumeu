import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {Provider} from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {syncReduxAndRouter} from 'redux-simple-router';
import configureStore from 'client/store/configureStore';
import {configureSocket, bindSocketToStore} from 'client/remote';
import App from 'client/containers/App';
import {HomeContainer} from 'client/containers/Home';
import {RegisterContainer} from 'client/containers/Register';
import {GameContainer} from 'client/containers/Game';

// SOCKET
const socket = configureSocket();

// STORE
const store = configureStore(undefined, socket);

bindSocketToStore(socket, store);

// ROUTING
const ROUTES = (
        <Route component={App}>
            <Route path="/" component={HomeContainer} />
            <Route path="/register" component={RegisterContainer} />
            <Route path="/games/:gameId" component={GameContainer} />
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
