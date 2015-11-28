// TODO: handle upside down ("undefined") cards
import classNames from 'classnames/dedupe';
import {range} from 'common/utils';

export default ({card, className}) => {
    const classes = classNames('card', className, 'card--malus-' + card.malus);

    return (
        <div className={classes}>
            <div className="card__top">
                <div className="card__value card__value--top">{card.value}</div>
                <div className="card__malus">
                    {
                        range(card.malus).map((val, idx) => (<span key={idx}></span>))
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
