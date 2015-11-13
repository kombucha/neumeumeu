// TODO: handle upside down ("undefined") cards
import classNames from 'classnames/dedupe';

export default ({card, className}) => {
    const classes = classNames('card', className, 'card--malus-' + card.malus);
    const malusRange = new Array(card.malus).join('_').split('_');
    return (
        <div className={classes}>
            <div className="card__top">
                <div className="card__value card__value--top">{card.value}</div>
                <div className="card__malus">
                    {
                        malusRange.map(range => (
                            <span></span>
                        ))
                    }
                </div>
            </div>
            <div className="card__value card__value--center">
                <span className="card__value__border">{card.value}</span>
                <span className="card__value__text">{card.value}</span>
            </div>
        </div>
    );
};
