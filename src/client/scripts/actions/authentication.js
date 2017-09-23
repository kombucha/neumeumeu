import api from "client/api";
import { addErrorMessage } from "client/actions/errors";
import { updatePath } from "redux-simple-router";

function loginSuccessful(dispatch, loginData, redirectToUrl = "/") {
  dispatch({
    type: "LOGIN",
    player: loginData.player,
    token: loginData.token,
  });

  dispatch(updatePath(redirectToUrl));

  return loginData;
}

function login(username, password, redirectTo) {
  return dispatch => {
    return api
      .login(username, password)
      .then(loginData => loginSuccessful(dispatch, loginData, redirectTo))
      .catch(error => dispatch(addErrorMessage(error)));
  };
}

function logout() {
  return dispatch =>
    api.logout().then(() => {
      dispatch({ type: "LOGOUT" });
      dispatch(updatePath("/"));
    });
}

function register(newUser, redirectTo) {
  return dispatch => {
    return api
      .register(newUser)
      .then(loginData => loginSuccessful(dispatch, loginData, redirectTo))
      .catch(error => dispatch(addErrorMessage(error)));
  };
}

export default {
  login,
  logout,
  register,
};
