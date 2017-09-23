function updateGames(state, games) {
  return games;
}

export default function games(state = [], action) {
  switch (action.type) {
    case "UPDATE_GAMES":
      return updateGames(state, action.games);
  }

  return state;
}
