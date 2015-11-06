/*
* Set the model/collection variables to state. Any data within
* the models & collections is automatically set to state based 
* on the keys they were inputted as. The only thing to note that's
* different here - a top level collection is automatically set 
* to `items`.
*/
var isObject = require('mout/lang/isObject');
var forEach  = require('mout/collection/forEach');


module.exports = function () {

  if (isObject(this.models)) {
    forEach(this.models, function (model, key) {
      var update = {};
      update[key] = model.toJSON();
      this.setState(update);
    }.bind(this));
  }

  if (isObject(this.collections)) {
    forEach(this.collections, function (collection, key) {
      var update = {};
      update[key] = collection.toJSON();
      this.setState(update);
    }.bind(this));
  }

};
