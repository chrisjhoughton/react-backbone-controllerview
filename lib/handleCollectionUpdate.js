/*
* When a collection is updated, we'll call `collectionDidUpdate` if it exists.
* If it doesn't, we will automatically set the state to the component.
*/
var isFunction = require('mout/lang/isFunction');

module.exports = function (collectionKey) {
  if (isFunction(this.collectionDidUpdate)) {
    this.collectionDidUpdate.call(this, modelKey);
  } else {
    var newState = {};
    newState[collectionKey] = this.collections[collectionKey].toJSON();
    this.setState.call(this, newState);
  }
};