export default ({malus}) => {
    return (
        <div className="malus">
            <span className="malus__border">{malus}</span>
            <span className="malus__value">{malus}</span>
        </div>
    );
};
