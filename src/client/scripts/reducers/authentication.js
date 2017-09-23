const DEFAULT_STATE = {
  player: null,
  token: null,
};

function login(state, token, player) {
  return {
    player,
    token,
  };
}

function logout() {
  return DEFAULT_STATE;
}

export default function users(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return login(state, action.token, action.player);
    case "LOGOUT":
      return logout();
    default:
      return state;
  }
}
