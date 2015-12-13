import {connect} from 'react-redux';
import {toggleAI} from 'client/actions';

export const AIToggle = ({player, gameId, toggleAI}) => (
    <form className="ai-toggle">
        <label className="form__label">
            <span className="form__text">Enable AI</span>
            <span className="form__checkbox">
                <input type="checkbox"
                    checked={player.AIEnabled}
                    onChange={(e) => {
                        e.preventDefault();
                        toggleAI(gameId, player.id, !player.AIEnabled);
                    }}/>
                <span className="form__checkbox__placeholder"></span>
            </span>
        </label>
    </form>
);

export const AIToggleContainer = connect(
    undefined,
    {toggleAI}
)(AIToggle);
