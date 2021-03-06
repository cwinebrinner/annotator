var assert = require('assertive-chai').assert;

var unsupported = require('../../../src/plugin/unsupported');


describe("unsupported.checkSupport()", function () {
    var scope = null;

    beforeEach(function () {
        scope = {
            getSelection: function () {},
            JSON: window.JSON
        };
    });

    it("supported is true if all is well", function () {
        var res = unsupported.checkSupport(scope);
        assert.isTrue(res.supported);
    });

    it("supported is false if scope has no getSelection function", function () {
        delete scope.getSelection;
        var res = unsupported.checkSupport(scope);
        assert.isFalse(res.supported);
    });

    it("supported is false if scope has no JSON object", function () {
        delete scope.JSON;
        var res = unsupported.checkSupport(scope);
        assert.isFalse(res.supported);
    });

    it("supported is false if scope JSON object has no stringify function", function () {
        scope.JSON = {
            parse: function () {}
        };
        var res = unsupported.checkSupport(scope);
        assert.isFalse(res.supported);
    });

    it("supported is false if scope JSON object has no parse function", function () {
        scope.JSON = {
            stringify: function () {}
        };
        var res = unsupported.checkSupport(scope);
        assert.isFalse(res.supported);
    });

    it("errors is empty if all is well", function () {
        var res = unsupported.checkSupport(scope);
        assert.deepEqual(res.errors, []);
    });

    it("returns extra details if details is true and everything is broken", function () {
        var res = unsupported.checkSupport({});
        assert.equal(res.errors.length, 2);
    });
});


describe('unsupported plugin', function () {
    var mockApp;
    var sandbox = sinon.sandbox.create();

    beforeEach(function () {
        mockApp = {
            notify: sandbox.stub()
        };

        sandbox.stub(unsupported, 'checkSupport').returns({
            supported: false,
            errors: ['widgets are discombobulated']
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should notify the user on start if Annotator does not support the current browser', function () {
        var plugin = unsupported.unsupported();
        plugin.start(mockApp);

        sinon.assert.calledWith(
            mockApp.notify,
            sinon.match('widgets are discombobulated')
        );
    });
});
