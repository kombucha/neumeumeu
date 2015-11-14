export default ({game}) => {
    return (
        <span>
            <span>{game.name}</span>
            <span>Players {game.players.length} / {game.maxPlayers}</span>
        </span>
    );
};
