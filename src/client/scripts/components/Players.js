import Player from './Player';

export default ({players}) => (
    <ul className="players">
        {
            players.map(player => (
                <li className="players__item" key={player.username}>
                    <Player player={player}/>
                </li>
            ))
        }
    </ul>
);
