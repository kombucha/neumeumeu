import api from 'client/api';
import {addErrorMessage} from 'client/actions/errors';
import {updatePath} from 'redux-simple-router';

function loginSuccessful(dispatch, loginData) {
    dispatch({
        type: 'LOGIN',
        player: loginData.player,
        token: loginData.token
    });

    dispatch(updatePath('/'));

    return loginData;
}

function login (username, password) {
    return dispatch => {
        return api.login(username, password)
            .then(loginData => loginSuccessful(dispatch, loginData))
            .catch(error => dispatch(addErrorMessage(error)));
    };
}

function logout() {
    return dispatch => api.logout()
        .then(() => {
            dispatch({type: 'LOGOUT'});
            dispatch(updatePath('/'));
        });
}

function register(newUser) {
    return dispatch => {
        return api.register(newUser)
            .then(loginData => loginSuccessful(dispatch, loginData))
            .catch(error => dispatch(addErrorMessage(error)));
    };
}

export default {
    login,
    logout,
    register
};
