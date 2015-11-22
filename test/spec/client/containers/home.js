import {expect, createComponent} from 'test/helpers';
import Home from 'client/containers/Home';

describe('Home', function () {
    let component;

    beforeEach(function () {
        const noOp = () => null;
        // FIXME: Meh, find a way to mock actionCreators bindings ?
        component = createComponent(Home, {fetchGames: noOp});
    });

    it('should create a new instance of Home', function () {
        expect(component).to.exist;
    });
});
