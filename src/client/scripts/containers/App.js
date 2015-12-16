import Messages from 'client/components/Messages';

export default (props) => (
    <div className="app">
        <Messages text="Error while login!"/>
        {props.children}
    </div>
);
