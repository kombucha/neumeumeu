import GameItem from './GameItem';

export default ({games, onGameItemSelected}) => (
    <ul>
        {
            games.map((game) => (
                <li key={game.id} onClick={() => onGameItemSelected(game)}>
                    <GameItem game={game} />
                </li>
            ))
        }
    </ul>
);
