// TODO: handle upside down ("undefined") cards
import classNames from 'classnames/dedupe';

export default ({card, className}) => {
    const classes = classNames('card', className);
    return (
        <div className={classes}>
            <div className="card__top">
                <div className="card__value card__value--top">{card.value}</div>
                <div className="card__malus">{card.malus}</div>
            </div>
            <div className="card__value card__value--center">{card.value}</div>
        </div>
    );
};
