import classNames from 'classnames/dedupe';
import {range} from 'common/utils';

export default ({card, className, onClick}) => {
    const isFlipped = !!card.value,
        classes = classNames(
        'card',
        className,
        isFlipped ? 'card--malus-' + card.malus : 'card--flipped');

    return (
        <div className={classes} onClick={onClick}>
            <div className="card__backface">
                <div className="card__value card__value--center"></div>
            </div>
            <div className="card__frontface">
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
        </div>
    );
};
