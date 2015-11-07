import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {Provider} from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import configureStore from 'client/store/configureStore';
import App from 'client/containers/App';
import {HomeContainer} from 'client/containers/Home';
import {RegisterContainer} from 'client/containers/Register';
import {GameContainer} from 'client/containers/Game';

// STORE
const store = configureStore();

// ROUTING
const ROUTES = (
        <Route component={App}>
            <Route path="/" component={HomeContainer} />
            <Route path="/register" component={RegisterContainer} />
            <Route path="/games/:gameId" component={GameContainer} />
        </Route>
    ),
    history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {ROUTES}
        </Router>
    </Provider>,
    document.getElementById('app-container'));
