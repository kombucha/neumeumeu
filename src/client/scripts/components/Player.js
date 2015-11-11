import Card from './Card';

export default ({player, defaultAvatarURL='/images/players/avatar-default.svg'}) => {
    const avatarURL = player.avatarURL || defaultAvatarURL;

    return (
        <div className="player">
            <img className="player__avatar" src={avatarURL} alt="{player.name}'s avatar"/>
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
};
