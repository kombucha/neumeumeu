import api from 'client/api';

function login (username, password) {
    return dispatch => {
        return api.login(username, password)
            .then(loginData => {
                dispatch({
                    type: 'LOGIN',
                    user: loginData.user,
                    token: loginData.token
                });

                return loginData;
            });
    };
}


export default {
    login
};
