import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {Provider} from 'react-redux';
import configureStore from 'client/store/configureStore';
import App from 'client/containers/App';
import {HomeContainer} from 'client/containers/Home';

// STORE
const store = configureStore();

// ROUTING
const ROUTES = (
    <Route component={App}>
        <Route path="/" component={HomeContainer} onEnter={HomeContainer.fetchData} />
    </Route>
);

ReactDOM.render(
    <Provider store={store}>
        <Router>{ROUTES}</Router>
    </Provider>,
    document.getElementById('app-container'));
