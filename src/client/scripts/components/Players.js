import Player from './Player';

export default ({players, highlightIdx = -1}) => (
    <ul className="players">
        {
            players.map((player, idx) => (
                <li className="players__item" key={player.id}>
                    <Player player={player}
                        className={idx === highlightIdx ? 'player--current' : null}/>
                </li>
            ))
        }
    </ul>
);
