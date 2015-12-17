import Player from './Player';

export default ({players, currentPlayerIndex = -1}) => (
    <ul className="players">
        {
            players.map((player, idx) => (
                <li className="players__item" key={player.id}>
                    <Player player={player}
                        isCurrentPlayer={idx === currentPlayerIndex}/>
                </li>
            ))
        }
    </ul>
);
