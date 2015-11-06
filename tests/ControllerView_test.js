var assert         = require('assert');
var _              = require('lodash');
var Backbone       = require('backbone');
var proxyquire     = require('proxyquire');
var ControllerView = require('../lib/ControllerView');


describe('ControllerView', function () {

  it('should hook into componentWillMount and componentWillUnmount', function () {
    assert(_.isFunction(ControllerView.componentWillMount));
    assert(_.isFunction(ControllerView.componentWillUnmount));
  });

  it('shouldn\'t hook into anything else!', function () {
    assert.strictEqual(_.keys(ControllerView).length, 2);
  });

  it('should call `setModelsAndCollections`, `setToState`, and `listenForChanges` in `componentWillMount`', function () {

    var setModelsAndCollectionsCalled = false;
    var setToStateCalled              = false;
    var listenForChangesCalled        = false;

    // stubs are amazing
    var proxyView = proxyquire('../lib/ControllerView', {
      './setModelsAndCollections': function () {
        setModelsAndCollectionsCalled = true;
      },
      './setToState': function () {
        setToStateCalled = true;
      },
      './listenForChanges': function () {
        listenForChangesCalled = true;
      },
    });

    proxyView.componentWillMount();

    assert(setModelsAndCollectionsCalled);
    assert(setToStateCalled);
    assert(listenForChangesCalled);

    // TODO should be checking context too here really

  });

  it('should call `stopListeningForChanges` in `componentWillUnmount`', function () {

    var stopListeningForChangesCalled = false;

    // stubs are amazing
    var proxyView = proxyquire('../lib/ControllerView', {
      './stopListeningForChanges': function () {
        stopListeningForChangesCalled = true;
      }
    });

    proxyView.componentWillUnmount();

    assert(stopListeningForChangesCalled);

    // TODO should be checking context too here really

  });
  


});