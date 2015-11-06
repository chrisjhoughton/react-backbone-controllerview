/*
* Stop listening to the model and collection
*/
var isObject = require('mout/lang/isObject');
var forEach  = require('mout/collection/forEach');


module.exports = function () {  
  var self = this;

  // Start listening for object of models
  if (this.models && isObject(this.models)) {
    forEach(this.models, function (model, key) {
      model.off("change sync", null, self);
    });
  }

  // Start listening for object of collections
  if (this.collections && isObject(this.collections)) {
    forEach(this.collections, function (collection, key) {
      collection.off("change add remove sync", null, self);
    });
  }
}