import React from 'react';
import shallowCompare from 'react/lib/shallowCompare';

export default class PureRender extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
}
