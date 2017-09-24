import api from "../api";
import { addErrorMessage } from "./errors";
import history from "../history";

function loginSuccessful(dispatch, loginData, redirectToUrl = "/") {
  dispatch({
    type: "LOGIN",
    player: loginData.player,
    token: loginData.token,
  });

  history.push(redirectToUrl);

  return loginData;
}

export function login(username, password, redirectTo) {
  return dispatch => {
    return api
      .login(username, password)
      .then(loginData => loginSuccessful(dispatch, loginData, redirectTo))
      .catch(error => dispatch(addErrorMessage(error)));
  };
}

export function logout() {
  return dispatch =>
    api.logout().then(() => {
      dispatch({ type: "LOGOUT" });
      history.push("/");
    });
}

export function register(newUser, redirectTo) {
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
