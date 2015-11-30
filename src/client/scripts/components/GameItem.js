export default ({game, canJoin, onJoin, onSpectate}) => {
    return (
        <span className="game-item">
            <span className="game-item__name">{game.name}</span>
            <span className="game-item__players">
                Players {game.players.length} / {game.maxPlayers}
            </span>
            <button className="game-item__action"
                disabled={!canJoin}
                onClick={() => onJoin(game)}>Join</button>
            <button className="game-item__action"
                onClick={() => onSpectate(game)}>Spectate</button>
        </span>
    );
};
