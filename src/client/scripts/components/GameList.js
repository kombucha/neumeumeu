import GameItem from './GameItem';

export default ({games, onGameItemSelected}) => (
    <ul>
        {
            games.map((game) => (
                <li key={game.get('id')} onClick={() => onGameItemSelected(game)}>
                    <GameItem game={game} />
                </li>
            ))
        }
    </ul>
);
