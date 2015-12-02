export default ({game, canJoin, onJoin}) => {
    return (
        <button className="game-item"
                disabled={!canJoin}
                onClick={() => onJoin(game)}>
            <span className="game-item__name">{game.name}</span>
            <span className="game-item__players">
                {game.players.length} / {game.maxPlayers}
            </span>
        </button>
    );
};
