import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from 'client/components/App';
import {HomeContainer} from 'client/components/Home';
import reducer from 'client/reducer';

// STORE
const store = createStore(reducer);


// ROUTING
const ROUTES = (
    <Route component={App}>
        <Route path="/" component={HomeContainer} />
    </Route>
);

ReactDOM.render(
    <Provider store={store}>
        <Router>{ROUTES}</Router>
    </Provider>,
    document.getElementById('app-container'));
