import GameItem from "client/components/GameItem";

export default ({ games, onSelectGame }) => {
  return (
    <ul className="game-list">
      {games.length === 0 ? (
        <li>No game in progress :(</li>
      ) : (
        games.map(game => (
          <li className="game-list__item" key={game.id}>
            <GameItem game={game} onClick={onSelectGame} />
          </li>
        ))
      )}
    </ul>
  );
};
