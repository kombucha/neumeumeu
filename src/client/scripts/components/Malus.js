import StrokedText from 'client/components/StrokedText';

export default ({malus, className}) => {

    return (
        <div className="malus">
            <StrokedText text={malus} double={true}/>
        </div>
    );
};
