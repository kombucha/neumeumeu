import {Link} from 'react-router';
import FormComponent from 'client/components/FormComponent';

export default class GameCreationForm extends FormComponent {
    constructor(props) {
        super(props);
        this.state = {
            isProtected: false,
            maxPlayers: 4
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const game = {
            ...this.state
        };
        this.props.onCreateGame(game);
    }

    onChange(stateProp) {
        return (e) => this.setState({[stateProp]: e.target.value});
    }

    onCheckboxChange(stateProp) {
        return (e) => this.setState({[stateProp]: e.target.checked});
    }

    render() {
        const {name, isProtected, password, maxPlayers} = this.state;

        return (
            <form className="game-creation-form"
                  onSubmit={this.handleSubmit.bind(this)}>
                <div className="game-creation-form__group">
                    <label htmlFor="game-name">Name:</label>
                    <input id="game-name" type="text" value={name} onChange={this.onChange('name')} required/>
                </div>

                <div className="game-creation-form__group">
                    <label htmlFor="game-protected">Protected ?:</label>
                    <input id="game-protected" type="checkbox" value={isProtected} onChange={this.onCheckboxChange('isProtected')}/>
                    <input id="game-password"
                           disabled={!isProtected}
                           type="password"
                           value={password}
                           onChange={this.onChange('password')}/>
                </div>

                <div className="game-creation-form__group">
                    <label>Max Players:</label>
                    <input type="range"
                           min="2" max="10" step="1"
                           value={maxPlayers}
                           onChange={this.onChange('maxPlayers')}/>
                    <span>{maxPlayers}</span>
                </div>

                <div className="game-creation-form__group game-creation-form__group--footer">
                    <button type="submit">Create</button>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        );
    }
}
