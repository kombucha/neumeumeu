import PureRenderComponent from './PureRenderComponent';

export default class GameItem extends PureRenderComponent {
    render() {

    }
}

export default ({game}) => {
    return (
        <span>
            <span>{game.id}</span>
            <span>Players {game.players.size} / {game.maxPlayers}</span>
        </span>
    );
};
