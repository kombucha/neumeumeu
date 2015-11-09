import Card from './Card';

export default ({player}) => (
    <div className="player">
        <div className="player__avatar">
            <img src={player.avatarURL} alt="{player.name}'s avatar"/>
        </div>
        <div className="player__username">
            {player.username}
        </div>
        {
            player.card ? (
                <div className="player__card">
                    <Card card={player.card}/>
                </div>
            ) : null
        }
    </div>
);
