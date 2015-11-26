import api from 'client/api';
import {updatePath} from 'redux-simple-router';

function loginSuccessful(dispatch, loginData) {
    dispatch({
        type: 'LOGIN',
        user: loginData.user,
        token: loginData.token
    });

    dispatch(updatePath('/'));

    return loginData;
}

function login (username, password) {
    return dispatch => {
        return api.login(username, password)
            .then(loginData => loginSuccessful(dispatch, loginData));
    };
}

function register(newUser) {
    return dispatch => {
        return api.register(newUser)
            .then(loginData => loginSuccessful(dispatch, loginData));
    };
}


export default {
    login,
    register
};
