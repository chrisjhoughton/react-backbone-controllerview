var assert         = require('assert');
var _              = require('lodash');
var Backbone       = require('backbone');
var proxyquire     = require('proxyquire');


describe('listenForChanges', function () {

  it('should listen for `change` and `sync` on models', function () {

    var user = new Backbone.Model({ name: 'Chris' });
    var client = new Backbone.Model({ company: 'Sauce' });

    var component = {
      models: {
        user: user,
        client: client
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
    user.trigger('sync');
    assert.strictEqual(modelKey, 'user');

    client.trigger('change');
    assert.strictEqual(modelKey, 'client');

    modelKey = undefined;
    client.trigger('sync');
    assert.strictEqual(modelKey, 'client');

  });

  it('should listen for `change`, `add`, `remove`, and `sync` on collections', function () {

    var users = new Backbone.Collection([{ name: 'Chris' }, { name: 'Steph' }]);
    var clients = new Backbone.Collection([{ company: 'Sauce' }, { company: 'Lamp' }]);

    var component = {
      collections: {
        users: users,
        clients: clients
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


    clients.trigger('change');
    assert.strictEqual(collectionKey, 'clients');

    collectionKey = undefined;
    clients.trigger('sync');
    assert.strictEqual(collectionKey, 'clients');

    collectionKey = undefined;
    clients.trigger('add');
    assert.strictEqual(collectionKey, 'clients');

    collectionKey = undefined;
    clients.trigger('remove');
    assert.strictEqual(collectionKey, 'clients');


  });

});
