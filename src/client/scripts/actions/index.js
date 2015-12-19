import {updatePath} from 'redux-simple-router';
import authentication from './authentication';
import games from './games';
import remote from './remote';
import gameplay from './gameplay';
import errors from './errors';

export default Object.assign({},
    authentication,
    games,
    remote,
    gameplay,
    errors,
    {updatePath}
);
