import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {Provider} from 'react-redux';
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
        <Route path="/game/:gameId" component={GameContainer} />
    </Route>
);

ReactDOM.render(
    <Provider store={store}>
        <Router>{ROUTES}</Router>
    </Provider>,
    document.getElementById('app-container'));
