var assert            = require('assert');
var _                 = require('lodash');
var Backbone          = require('backbone');
var handleModelUpdate = require('../lib/handleModelUpdate');


describe('handleModelUpdate', function () {

  it('should set the new model to state', function () {
    var user = new Backbone.Model({
      id: 1,
      name: 'Chris'
    });

    var newState;

    var component = {
      setState: function (data) {
        newState = data;
      },
      models: {
        user: user
      }
    };

    handleModelUpdate.call(component, 'user');
    assert.deepEqual(newState, {
      user: {
        id: 1,
        name: 'Chris'
      }
    });

    user.set('name', 'Steph');
    assert.strictEqual(newState.user.name, 'Chris');
    handleModelUpdate.call(component, 'user');
    assert.deepEqual(newState, {
      user: {
        id: 1,
        name: 'Steph'
      }
    });
  });

  it('should call `modelDidUpdate` instead, if declared', function () {
    var modelKey;

    var component = {
      modelDidUpdate: function (key) {
        modelKey = key;
      }
    };

    handleModelUpdate.call(component, 'user');
    assert.strictEqual(modelKey, 'user');

    handleModelUpdate.call(component, 'client');
    assert.strictEqual(modelKey, 'client');
  });

});
