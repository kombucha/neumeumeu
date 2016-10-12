import {Component} from 'react';
import ChatConf from 'common/constants/chat';

export default class Chatbox extends Component {
    handleEnterKey(ev) {
        if (this.props.onSubmitMessage && ev.which === 13) {
            const trimmedMessage = this.refs.messageInput.value ? this.refs.messageInput.value.trim() : null;

            if (trimmedMessage.length > 0) { //&& (!this.state || this.state.lastMessage != trimmedMessage)) {
                // this.setState({
                //     lastMessage: trimmedMessage
                // });
                this.props.onSubmitMessage(trimmedMessage);
                //Reset input
                this.refs.messageInput.value = '';
            }
            ev.preventDefault();
        }
    }
    handleDocumentKeyPress(ev) {
        if (ev.target.tagName.toLowerCase() != 'input' && ev.target.tagName.toLowerCase() != 'textarea') {
            var code = ev.which;
            if (!ev.ctrlKey
                &&
                ((code > 47 && code < 58) // numeric (0-9)
                ||
                (code > 64 && code < 91) // upper alpha (A-Z)
                ||
                (code > 96 && code < 123))) { // lower alpha (a-z)
                this.refs.messageInput.value += String.fromCharCode(code);
                this.refs.messageInput.focus();
                ev.preventDefault();
            }
        }
    }
    componentDidMount() {
        if (this.props.autoFocus) {
            //User can type without click on the input
            window.addEventListener('keypress', this.handleDocumentKeyPress.bind(this), false);
        }
    }
    componentWillUnmount() {
        if (this.props.autoFocus) {
            //Remove event where user can type without click on the input
            window.removeEventListener('keypress', this.handleDocumentKeyPress.bind(this), false);
        }
    }

    render() {
        return (
			<input type="text" ref="messageInput" name="chat-message" maxLength={ChatConf.MESSAGE_MAX_LENGTH}
                placeholder='Type and press Enter !'
                onKeyPress={this.handleEnterKey.bind(this)}/>
        );
    }
}
