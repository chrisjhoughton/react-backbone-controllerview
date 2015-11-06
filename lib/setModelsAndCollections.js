/*
* Start up models and collections. This is specifically 
* when models or collections are passed as classes, and not instantiated. 
* This is a good thing, because it means we instantiate 
*/
var isFunction = require('mout/lang/isFunction');

module.exports = function () {
  if (isFunction(this.getModels)) {
    this.models = this.getModels.call(this);
  }
  if (_.isFunction(this.getCollections)) {
    this.collections = this.getCollections.call(this);
  }
};
