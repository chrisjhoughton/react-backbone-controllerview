/*
* Listen for changes to the models and collections
*/
var forEach                = require('mout/collection/forEach');
var isObject               = require('mout/lang/isObject');
var handleModelUpdate      = require('./handleModelUpdate');
var handleCollectionUpdate = require('./handleCollectionUpdate');


module.exports = function () {
  var self = this;

  // Start listening for object of models
  if (this.models && isObject(this.models)) {
    forEach(this.models, function (model, key) {
      model.on("change sync", function () {
        handleModelUpdate.call(self, key);
      }, self);
    });
  }


  // Start listening for object of collections
  if (this.collections && isObject(this.collections)) {
    forEach(this.collections, function (collection, key) {
      collection.on("change add remove sync", function () {
        handleCollectionUpdate.call(self, key);
      }, self);
    });
  }

};