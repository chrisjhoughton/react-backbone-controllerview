var assert                  = require('assert');
var _                       = require('lodash');
var Backbone                = require('backbone');
var proxyquire              = require('proxyquire');
var stopListeningForChanges = require('../lib/stopListeningForChanges');


describe('stopListeningForChanges', function () {

  it('should stop listen for `change` and `sync` on models', function () {

    var user = new Backbone.Model({ name: 'Chris' });

    var component = {
      models: {
        user: user
      }
    };

    var modelKey;
    var listenForChanges = proxyquire('../lib/listenForChanges', {
      './handleModelUpdate': function (key) {
        modelKey = key;
      }
    });

    listenForChanges.call(component);

    user.trigger('change');
    assert.strictEqual(modelKey, 'user');

    modelKey = undefined;
    stopListeningForChanges.call(component);
    user.trigger('change');
    assert(_.isUndefined(modelKey));

    user.trigger('sync');
    assert(_.isUndefined(modelKey));

  });

  it('should stop listening for `change`, `add`, `remove`, and `sync` on collections', function () {

    var users = new Backbone.Collection([{ name: 'Chris' }, { name: 'Steph' }]);

    var component = {
      collections: {
        users: users
      }
    };

    var collectionKey;
    var listenForChanges = proxyquire('../lib/listenForChanges', {
      './handleCollectionUpdate': function (key) {
        collectionKey = key;
      }
    });

    listenForChanges.call(component);

    users.trigger('change');
    assert.strictEqual(collectionKey, 'users');

    collectionKey = undefined;
    users.trigger('sync');
    assert.strictEqual(collectionKey, 'users');

    collectionKey = undefined;
    users.trigger('add');
    assert.strictEqual(collectionKey, 'users');

    collectionKey = undefined;
    users.trigger('remove');
    assert.strictEqual(collectionKey, 'users');

    stopListeningForChanges.call(component);

    collectionKey = undefined;
    users.trigger('change');
    assert(_.isUndefined(collectionKey));

    collectionKey = undefined;
    users.trigger('sync');
    assert(_.isUndefined(collectionKey));

    collectionKey = undefined;
    users.trigger('add');
    assert(_.isUndefined(collectionKey));

    collectionKey = undefined;
    users.trigger('remove');
    assert(_.isUndefined(collectionKey));


  });

});
