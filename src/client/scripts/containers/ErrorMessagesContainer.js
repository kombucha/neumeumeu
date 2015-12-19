import {connect} from 'react-redux';
import ErrorMessage from 'client/components/ErrorMessage';
import {popLastErrorMessage} from 'client/actions/errors';
import PureRenderComponent from 'client/components/PureRenderComponent';

const MESSAGE_TIME = 1000;

class ErrorMessagesContainer extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        const {errors} = nextProps;

        if (errors.length === 0) {
            return this.setState({message: null});
        } else if (errors[0] !== this.state.message) {
            return this.showMessage(errors[0]);
        }
    }

    showMessage(message) {
        this.setState({message});
        this.popMessageIn(message.duration || MESSAGE_TIME);
    }

    popMessageIn(duration) {
        // I probably don't need to be defensive, this component will be present
        // For the entire life time of the application
        setTimeout(() => {
            this.props.popLastErrorMessage();
        }, duration);
    }

    render() {
        const {message} = this.state,
            hasMessage = !!message,
            messageText = hasMessage ? message.text : null;

        return (
            <ErrorMessage text={messageText}/>
        );
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors
    };
}

export default connect(
    mapStateToProps,
    {popLastErrorMessage}
)(ErrorMessagesContainer);
