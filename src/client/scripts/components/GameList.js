import GameItem from './GameItem';
import {Link} from 'react-router';

export default ({games}) => (
    <ul>
        {
            games.map((game) => (
                <li key={game.id}>
                    <Link to={`/games/${game.id}`}>
                        <GameItem game={game} />
                    </Link>
                </li>
            ))
        }
    </ul>
);
