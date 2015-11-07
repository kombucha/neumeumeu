import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import * as actionCreators from 'client/actions';

export default class Game extends PureRenderComponent {
    componentWillMount() {
        // TODO: only load current game !
        this.props.fetchGames();
    }

    render() {
        return (
            <div>
                {JSON.stringify(this.props.game, null, 2)}
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const gameId = parseInt(props.params.gameId, 10);
    return {
        game: (state.games || []).filter(game => game.id === gameId)[0]
    };
}

export const GameContainer = connect(
    mapStateToProps,
    actionCreators
)(Game);
