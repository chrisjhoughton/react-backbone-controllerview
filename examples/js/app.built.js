(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Simple app to compile the controller view and expose it as a 
* window variable for example purposes. Nothing else to see here.
*/
var ControllerView = require('../../lib/ControllerView');

window.ControllerView = ControllerView;

},{"../../lib/ControllerView":2}],2:[function(require,module,exports){
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

},{"./listenForChanges":5,"./setModelsAndCollections":6,"./setToState":7,"./stopListeningForChanges":8}],3:[function(require,module,exports){
/*
* When a collection is updated, we'll call `collectionDidUpdate` if it exists.
* If it doesn't, we will automatically set the state to the component.
*/
var isFunction = require('mout/lang/isFunction');

module.exports = function (collectionKey) {
  if (isFunction(this.collectionDidUpdate)) {
    this.collectionDidUpdate.call(this, collectionKey);
  } else {
    var newState = {};
    newState[collectionKey] = this.collections[collectionKey].toJSON();
    this.setState.call(this, newState);
  }
};

},{"mout/lang/isFunction":13}],4:[function(require,module,exports){
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

},{"mout/lang/isFunction":13}],5:[function(require,module,exports){
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

},{"./handleCollectionUpdate":3,"./handleModelUpdate":4,"mout/collection/forEach":11,"mout/lang/isObject":15}],6:[function(require,module,exports){
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
  if (isFunction(this.getCollections)) {
    this.collections = this.getCollections.call(this);
  }
};

},{"mout/lang/isFunction":13}],7:[function(require,module,exports){
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

},{"mout/collection/forEach":11,"mout/lang/isObject":15}],8:[function(require,module,exports){
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
};

},{"mout/collection/forEach":11,"mout/lang/isObject":15}],9:[function(require,module,exports){


    /**
     * Array forEach
     */
    function forEach(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    module.exports = forEach;



},{}],10:[function(require,module,exports){


    /**
     * Create slice of source array or array-like object
     */
    function slice(arr, start, end){
        var len = arr.length;

        if (start == null) {
            start = 0;
        } else if (start < 0) {
            start = Math.max(len + start, 0);
        } else {
            start = Math.min(start, len);
        }

        if (end == null) {
            end = len;
        } else if (end < 0) {
            end = Math.max(len + end, 0);
        } else {
            end = Math.min(end, len);
        }

        var result = [];
        while (start < end) {
            result.push(arr[start++]);
        }

        return result;
    }

    module.exports = slice;



},{}],11:[function(require,module,exports){
var make = require('./make_');
var arrForEach = require('../array/forEach');
var objForEach = require('../object/forOwn');

    /**
     */
    module.exports = make(arrForEach, objForEach);



},{"../array/forEach":9,"../object/forOwn":18,"./make_":12}],12:[function(require,module,exports){
var slice = require('../array/slice');

    /**
     * internal method used to create other collection modules.
     */
    function makeCollectionMethod(arrMethod, objMethod, defaultReturn) {
        return function(){
            var args = slice(arguments);
            if (args[0] == null) {
                return defaultReturn;
            }
            // array-like is treated as array
            return (typeof args[0].length === 'number')? arrMethod.apply(null, args) : objMethod.apply(null, args);
        };
    }

    module.exports = makeCollectionMethod;



},{"../array/slice":10}],13:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":14}],14:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":16}],15:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":14}],16:[function(require,module,exports){


    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    module.exports = kindOf;


},{}],17:[function(require,module,exports){
var hasOwn = require('./hasOwn');

    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }


        if (_hasDontEnumBug) {
            var ctor = obj.constructor,
                isProto = !!ctor && obj === ctor.prototype;

            while (key = _dontEnums[i++]) {
                // For constructor, if it is a prototype object the constructor
                // is always non-enumerable unless defined otherwise (and
                // enumerated above).  For non-prototype objects, it will have
                // to be defined on this object, since it cannot be defined on
                // any prototype objects.
                //
                // For other [[DontEnum]] properties, check if the value is
                // different than Object prototype value.
                if (
                    (key !== 'constructor' ||
                        (!isProto && hasOwn(obj, key))) &&
                    obj[key] !== Object.prototype[key]
                ) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    module.exports = forIn;



},{"./hasOwn":19}],18:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var forIn = require('./forIn');

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    module.exports = forOwn;



},{"./forIn":17,"./hasOwn":19}],19:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}]},{},[1]);
