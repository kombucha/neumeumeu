import Player from './Player';

export default ({players}) => (
    <ul className="players">
        {
            players.map(player => (
                <li className="players__item" key={player.id}>
                    <Player player={player}/>
                </li>
            ))
        }
    </ul>
);
