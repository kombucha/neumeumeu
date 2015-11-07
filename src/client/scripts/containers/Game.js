import {connect} from 'react-redux';
import {List} from 'immutable';
import PureRenderComponent from 'client/components/PureRenderComponent';
import * as actionCreators from 'client/actions';

export default class Game extends PureRenderComponent {
    componentWillMount() {
        // TODO: only load current game !
        this.props.fetchGames();
    }

    render() {
        const game = this.props.game ? this.props.game.toJS() : null;
        return (
            <div>
                {
                    game ? JSON.stringify(game, null, 2) : game
                }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const gameId = parseInt(props.params.gameId, 10);
    return {
        game: state.get('games', List())
                   .filter(game => game.get('id') === gameId)
                   .get(0, null)
    };
}

export const GameContainer = connect(
    mapStateToProps,
    actionCreators
)(Game);
