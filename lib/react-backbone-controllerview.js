/*
* The controller view mixin is specifically designed to help react views
* work more closely with Backbone. The views that use this should be "controller-views",
* views that are more about controlling an overall application than
* rendering an individual component of it.
*
* Importantly, controller views are the only ones with access to Backbone
* models/collections. They take the contents as `state`, and then pass
* it down to child components as props.
*
* When a Backbone model/collection updates, the state automatically updates
* unless explicitly specified in the controller-view.
*/
var _        = require("lodash");
var Backbone = require("backbone");


/*
* Start up models and collections. This is specifically 
* when models or collections are passed as classes, and not instantiated. 
* This is a good thing, because it means we instantiate 
*/
var setModelsAndCollections = function () {
  if (_.isFunction(this.getModels)) {
    this.models = this.getModels.call(this);
  }
  if (_.isFunction(this.getCollections)) {
    this.collections = this.getCollections.call(this);
  }
};

/*
* Set the model/collection variables to state. Any data within
* the models & collections is automatically set to state based 
* on the keys they were inputted as. The only thing to note that's
* different here - a top level collection is automatically set 
* to `items`.
*/
var setToState = function () {

  if (_.isObject(this.models)) {
    _.each(this.models, function (model, key) {
      var update = {};
      update[key] = model.toJSON();
      this.setState(update);
    }.bind(this));
  }

  if (this.collections) {
    _.each(this.collections, function (collection, key) {
      var update = {};
      update[key] = collection.toJSON();
      this.setState(update);
    }.bind(this));
  }

};


/*
* Listen for changes to the models and collections
*/
var listenForChanges = function () {
  var self = this;

  // Start listening for object of models
  if (this.models && _.isObject(this.models)) {
    _.each(this.models, function (model, key) {
      model.on("change sync", function () {
        handleModelUpdate.call(self, key);
      }, self);
    });
  }


  // Start listening for object of collections
  if (this.collections && _.isObject(this.collections)) {
    _.each(this.collections, function (collection, key) {
      collection.on("change add remove sync", function () {
        handleCollectionUpdate.call(self, key);
      }, self);
    });
  }

};


/*
* When a model is updated, we'll call `modelDidUpdate` if it exists.
* If it doesn't, we will automatically set the state to the component.
* This allows us simple default controller code, while also having the flexibility
* to override it and set up custom subscriptions when necessary
*/
var handleModelUpdate = function (modelKey) {
  if (_.isFunction(this.modelDidUpdate)) {
    this.modelDidUpdate.call(this, modelKey);
  } else {
    var newState = {};
    newState[modelKey] = this.models[modelKey].toJSON();
    this.setState.call(this, newState);
  }
};

/*
* When a collection is updated, we'll call `collectionDidUpdate` if it exists.
* If it doesn't, we will automatically set the state to the component.
*/
var handleCollectionUpdate = function (collectionKey) {
  if (_.isFunction(this.collectionDidUpdate)) {
    this.collectionDidUpdate.call(this, modelKey);
  } else {
    var newState = {};
    newState[collectionKey] = this.collections[collectionKey].toJSON();
    this.setState.call(this, newState);
  }
};


/*
* Stop listening to the model and collection
*/
var stopListeningForChanges = function () {  
  var self = this;

  // Start listening for object of models
  if (this.models && _.isObject(this.models)) {
    _.each(this.models, function (model, key) {
      model.off("change sync", null, self);
    });
  }

  // Start listening for object of collections
  if (this.collections && _.isObject(this.collections)) {
    _.each(this.collections, function (collection, key) {
      collection.off("change add remove sync", null, self);
    });
  }
}


var ControllerView = {


  /*
  * Bind listeners on models and collections assigned to any of the following:
  * `this.models`, `this.collections`.
  *
  * Call `collectionDidUpdate`, `modelDidUpdate` for the controller view to respond.
  */
  componentWillMount: function () {

    // Instantiate models that haven't yet been instantiated
    // This is because we allow for classes to be passed to `model` etc as well
    setModelsAndCollections.call(this);

    // Set the models and collections to state
    setToState.call(this);

    // Start listening for changes to models and collections
    listenForChanges.call(this);

  },


  /*
  * Unbind all listners for this component.
  */
  componentWillUnmount: function() {
    stopListeningForChanges.call(this);
  },

};

module.exports = ControllerView;