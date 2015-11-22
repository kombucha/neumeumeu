import chai from 'chai';
import sinonChai from 'sinon-chai';
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';

chai.use(sinonChai);

global.__USE_MOCKS__ = true;

export const expect = chai.expect;

// See http://simonsmith.io/unit-testing-react-components-without-a-dom/
export function createComponent(component, props, ...children) {
    const shallowRenderer = createRenderer();
    shallowRenderer.render(React.createElement(component, props, children.length > 1 ? children : children[0]));
    return shallowRenderer.getRenderOutput();
}
