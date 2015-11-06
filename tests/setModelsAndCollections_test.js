var assert                  = require('assert');
var _                       = require('lodash');
var Backbone                = require('backbone');
var setModelsAndCollections = require('../lib/setModelsAndCollections');


describe('setModelsAndCollections', function () {

  it('should set the models', function () {

    var User = Backbone.Model.extend({
      getFullName: function () {
        return this.get('firstName') + ' ' + this.get('lastName'); 
      }
    }); 

    var component = {
      getModels: function () {
        return {
          user: new User({
            firstName: 'Chris',
            lastName: 'Houghton'
          }),
          otherUser: new User({
            firstName: 'Steph',
            lastName: 'Houghton'
          }),
        };
      }
    };

    setModelsAndCollections.call(component);

    assert(component.models.user instanceof User);
    assert.strictEqual(component.models.user.getFullName(), 'Chris Houghton');

    assert(component.models.otherUser instanceof User);
    assert.strictEqual(component.models.otherUser.getFullName(), 'Steph Houghton');

  });

  it('should set the collections', function () {

    var component = {
      getCollections: function () {
        return {
          skittles: new Backbone.Collection([{
            id: 1,
            color: 'blue'
          }, {
            id: 2,
            color: 'red'
          }])
        };
      }
    };

    setModelsAndCollections.call(component);

    assert(component.collections.skittles instanceof Backbone.Collection);
    assert.strictEqual(component.collections.skittles.at(1).get('color'), 'red');

  });
  

  it('should not set models if `getModels` isn\'t a function', function () {
    var component = {
      getModels: {
        user: new Backbone.Model({ name: 'Chris' })
      }
    };
    setModelsAndCollections.call(component);
    assert(_.isUndefined(component.models));
  });

  it('should not set collections if `getCollections` isn\'t a function', function () {
    var component = {
      getCollections: {
        user: new Backbone.Collection([{ name: 'Chris' }])
      }
    };
    setModelsAndCollections.call(component);
    assert(_.isUndefined(component.collections));
  });


});

