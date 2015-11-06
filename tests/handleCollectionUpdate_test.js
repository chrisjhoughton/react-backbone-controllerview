var assert                 = require('assert');
var _                      = require('lodash');
var Backbone               = require('backbone');
var handleCollectionUpdate = require('../lib/handleCollectionUpdate');


describe('handleCollectionUpdate', function () {

  it('should set the new collection to state', function () {

    var skittles = new Backbone.Collection([{
      id: 1,
      color: 'red'
    }, {
      id: 2,
      color: 'blue'
    }]);

    var newState;

    var component = {
      setState: function (data) {
        newState = data;
      },
      collections: {
        skittles: skittles
      }
    };

    handleCollectionUpdate.call(component, 'skittles');
    assert.deepEqual(newState, {
      skittles: [{
        id: 1,
        color: 'red'
      }, {
        id: 2,
        color: 'blue'
      }]
    });

    skittles.add({ id: 3, color: 'yellow' });
    assert.strictEqual(newState.skittles.length, 2);
    handleCollectionUpdate.call(component, 'skittles');
    assert.deepEqual(newState, {
      skittles: [{
        id: 1,
        color: 'red'
      }, {
        id: 2,
        color: 'blue'
      }, {
        id: 3,
        color: 'yellow'
      }]
    });
  });

  it('should call `collectionDidUpdate` instead, if declared', function () {
    var collectionKey;

    var component = {
      collectionDidUpdate: function (key) {
        collectionKey = key;
      }
    };

    handleCollectionUpdate.call(component, 'users');
    assert.strictEqual(collectionKey, 'users');

    handleCollectionUpdate.call(component, 'clients');
    assert.strictEqual(collectionKey, 'clients');
  });

});
