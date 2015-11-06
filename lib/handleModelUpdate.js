/*
* When a model is updated, we'll call `modelDidUpdate` if it exists.
* If it doesn't, we will automatically set the state to the component.
* This allows us simple default controller code, while also having the flexibility
* to override it and set up custom subscriptions when necessary
*/
var isFunction = require('mout/lang/isFunction');

module.exports = function (modelKey) {
  if (isFunction(this.modelDidUpdate)) {
    this.modelDidUpdate.call(this, modelKey);
  } else {
    var newState = {};
    newState[modelKey] = this.models[modelKey].toJSON();
    this.setState.call(this, newState);
  }
};
