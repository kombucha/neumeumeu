export default ({text}) => {
    return (
        <span className="stroked-text">
            <span className="stroked-text__stroke">{text}</span>
            <span className="stroked-text__fill">{text}</span>
        </span>
    );
};
