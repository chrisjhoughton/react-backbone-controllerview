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
var setModelsAndCollections = require('./setModelsAndCollections');
var setToState              = require('./setToState');
var listenForChanges        = require('./listenForChanges');
var stopListeningForChanges = require('./stopListeningForChanges');


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
  }

};


module.exports = ControllerView;