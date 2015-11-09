// TODO: handle upside down ("undefined") cards

export default ({card}) => (
    <div className="card">
        <div className="card__value--small">{card.value}</div>
        <div className="card__malus">{card.malus}</div>
        <div className="card__value--big">{card.value}</div>
    </div>
);
