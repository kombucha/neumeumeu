import PureRenderComponent from './PureRenderComponent';

export default class GameItem extends PureRenderComponent {
    render() {

    }
}

export default ({game}) => {
    return (
        <span>
            <span>{game.get('id')}</span>
            <span>Players {game.get('players').size} / {game.get('maxPlayers')}</span>
        </span>
    );
};
