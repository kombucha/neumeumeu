import {expect, createComponent} from 'test/helpers';
import Home from 'client/components/Home';

describe('Home', function () {
    let component;

    beforeEach(function () {
        component = createComponent(Home);
    });

    it('should create a new instance of Home', function () {
        expect(component).to.exist;
    });
});
