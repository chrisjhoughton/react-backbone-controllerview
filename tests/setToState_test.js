var assert     = require('assert');
var _          = require('lodash');
var Backbone   = require('backbone');
var setToState = require('../lib/setToState');


describe('setToState', function () {

  it('should set models and collections to state', function () {
    var component = {
      state: {},
      setState: function (newState) {
        _.extend(this.state, newState);
      },
      models: {
        user: new Backbone.Model({ firstName: 'Chris', lastName: 'Houghton' }),
        client: new Backbone.Model({ company: 'Sauce', plan: 'premium' })
      },
      collections: {
        skittles: new Backbone.Collection([{
          id: 1,
          color: 'blue'
        }, {
          id: 2,
          color: 'red'
        }])
      }
    };

    setToState.call(component);

    assert.strictEqual(component.state.user.firstName, 'Chris');
    assert.strictEqual(component.state.user.lastName, 'Houghton');

    assert.strictEqual(component.state.client.company, 'Sauce');
    assert.strictEqual(component.state.client.plan, 'premium');

    assert.strictEqual(component.state.skittles[0].id, 1);
    assert.strictEqual(component.state.skittles[0].color, 'blue');

    assert.strictEqual(component.state.skittles[1].id, 2);
    assert.strictEqual(component.state.skittles[1].color, 'red');
  });

});