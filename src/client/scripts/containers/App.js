import ErrorMessagesContainer from "client/containers/ErrorMessagesContainer";

export default props => (
  <div className="app">
    <ErrorMessagesContainer text="Error while login!" />
    {props.children}
  </div>
);
