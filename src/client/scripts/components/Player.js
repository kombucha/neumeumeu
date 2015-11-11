import Card from './Card';

export default ({player, defaultAvatarURL}) => {
    const defaultAvatar = defaultAvatarURL || 'assets/images/default-avatar.png';
    const avatarURL = player.avatarURL || defaultAvatar;

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
