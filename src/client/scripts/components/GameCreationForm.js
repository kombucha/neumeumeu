import {Link} from 'react-router';
import FormComponent from 'client/components/FormComponent';
import StrokedText from 'client/components/StrokedText';

export default class GameCreationForm extends FormComponent {
    constructor(props) {
        super(props);
        this.state = {
            isProtected: false,
            maxMalus: 66,
            maxPlayers: 4
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const game = Object.assign({}, this.state);
        this.props.onCreateGame(game);
    }

    onChange(stateProp) {
        return (e) => this.setState({[stateProp]: e.target.value});
    }

    onCheckboxChange(stateProp) {
        return (e) => this.setState({[stateProp]: e.target.checked});
    }

    render() {
        const {name, isProtected, password, maxMalus, maxPlayers} = this.state;

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <p className="form__text">New game</p>
                <input type="text"
                    placeholder="Name"
                    value={name}
                    onChange={this.onChange('name')} required/>

                <label className="form__label">
                    <span className="form__text">Protected ?</span>
                    <span className="form__checkbox">
                        <input type="checkbox"
                            value={isProtected}
                            onChange={this.onCheckboxChange('isProtected')}/>
                        <span className="form__checkbox__placeholder"></span>
                    </span>
                </label>

                <input disabled={!isProtected}
                       type="password"
                       value={password}
                       onChange={this.onChange('password')}/>

                <label className="form__label">
                    <span className="form__text">Max Players</span>
                    <div className="form__range">
                        <span className="form__range__value">{maxPlayers}</span>
                        <input type="range"
                               min="2"
                               max="10"
                               step="1"
                               value={maxPlayers}
                               onChange={this.onChange('maxPlayers')}/>
                    </div>
                </label>

                <label className="form__label">
                    <span className="form__text">Max Malus</span>
                    <div className="form__range">
                        <span className="form__range__value">{maxMalus}</span>
                        <input type="range"
                               min="20"
                               max="200"
                               step="1"
                               value={maxMalus}
                               onChange={this.onChange('maxMalus')}/>
                    </div>
                </label>

                <div className="form__actions">
                    <Link className="button" to="/">
                        <StrokedText text="Cancel"/>
                    </Link>
                    <button className="button" type="submit">
                        <StrokedText text="Create"/>
                    </button>
                </div>
            </form>
        );
    }
}
