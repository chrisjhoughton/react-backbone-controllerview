# React-Backbone Controller View

A simple mixin to bind Backbone models and collections to React components. 

Aims to do four things:

* Embrace React's uni-directional data flow
* Provide a simple declarative approach
* Let you write less code
* Allow for full view control on model/collection changes

### Contents:

* [Installation & quick-start](#installation--quick-start)
* [Inspiration](#inspiration)
* [Usage](#api--usage)
* [Changelog](#changelog)
* [Contributing](#contributing)
* [License](#license)


## Installation & quick start

### 1. Install the mixin:

```
npm install rb-controllerview
```

### 2. Add the mixin to your components

```js
var React          = require('react');
var ControllerView = require('rb-controllerview');

var MyComponent = React.createClass({
  
  mixins: [ ControllerView ],

  // Declare any models in the view - any models will get set to state
  // by calling `toJSON()` internally.
  getModels: function () {
    return {
      user: new Backbone.Model({ name: 'Chris Houghton '})
    };
  },

  render: function () {
    return (
      <div>
        Hey there, my name is {this.state.user.name}.
      </div>
    );
  }

});
```

### 3. Updates automatically happen

Whenever the model updates, the `state` will automatically be updated, resulting
in the desired UI updates.





## Inspiration 

While there are a number of other Backbone-related React components out there, none of them provide 
a simple & declarative approach. When looking ourselves, we found that a lot of the components out there 
seemed to be _fighting_ "the React way", rather than going along with it.

React's concept of uni-directional data flow is crackin'. It adds simplicity to applications, 
making components simple to understand and debug.

When integrating Backbone with React, there's a few key challenges & questions:

1. How can I ensure that views update when the model/collection changes?
2. Is it possible to avoid writing `on('change')` and `on('sync')` all over the place?
3. Just which component "owns" the data?


There's a few possible options:

|                                               Option                                              |                                                                                                                               The good & the bad                                                                                                                               |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Passing the model directly as a `prop`, and using a parent "controller" around each component. | Sounds simple, it isn't. The component won't automatically hook into model updates and update the views, so you'll need `forceUpdate` (bad). Also, if the model is passed to child components, anyone in the hierarchy can update the data, which breaks uni-directional flow. |
| 2. Declaring the model directly as a property of the component.                                   | This is cleaner, you'll usually declare the model within `componentWillMount`. Even if you don't pass the model directly to children, there's still the above issue of running `forceUpdate`.                                                                                         |
| 3. Set the model's full data to state before mount, and __never__ pass the model to children.     | Cleaner still. Also, by setting all data to state, React will automatically update components. The component that "owns" the model can make the updates, if the children need to, then can do so by passing functions as `props`. (Fits with React uni-directional flow)       |

This mixin goes for the __third option__:

* Models & collections are declared internally within the component before mount
* All data from models and collections is set to `state`
* Updates/syncs automatically cause the `state` to update (but they don't _have_ to)

The term "controller-view" was inspired by [Flux](https://facebook.github.io/flux/docs/overview.html), where one React component
controls the data flow, and acts as the glue between the data models and the UI.

To answer the question:

> "Where should the controller view live in the hierarchy?" 

It's actually better to ask the question:

> "Where should the __state__ live in the hierarchy?"

And to answer _this_ question, read [this part of "Thinking in React"](https://facebook.github.io/react/docs/thinking-in-react.html#step-4-identify-where-your-state-should-live).


## API & usage

Before using this mixin, there's a few things to remember:

* Models & collections should be declared in the `getModels` and `getCollections` functions, returning key-model objects
* Models & collections are automatically set to `state` using the key in the declaration above (happens in `componentWillMount`)
* Models automatically get re-set to `state` on the Backbone events: `sync`, `change`
* Collections automatically get re-set to `state` on the Backbone events: `sync`, `change`, `add`, `remove`
* Don't declare models and collections with the same key, or with the key of another state value


### Basic usage

You'll need to declare `ControllerView` as a mixin in the React component you'd like to act as a 
controller-view, and then declare your Backbone models and collections using `getModels` and `getCollections`.

For example, you might have a page where you can see a list of [skittles](https://www.google.co.uk/search?q=skittles&es_sm=119&source=lnms&tbm=isch&sa=X&ved=0CAcQ_AUoAWoVChMI-PDx0_T7yAIVhG4UCh1iawus&biw=1280&bih=701) that a user owns:

```js
var $              = require('jquery');
var React          = require('react');
var ControllerView = require('rb-controllerview');
var user           = require('models/user'); // instance, not class
var skittles       = require('collections/skittles'); // instance, not class

var UserSkittles = React.createClass({  

  mixins: [ ControllerView ],

  getModels: function () {
    return {
      user: user({ id: this.props.id });
    };
  },

  getCollections: function () {
    return {
      skittles: skittles([], { user_id: this.props.id });
    };
  },

  render: function () {
    var skittles = this.state.skittles.map(function (skittle) {
      return <li key={skittle.id}>{skittle.color}</li>
    });

    return (
      <div>
        {this.state.user.name+"'s"} skittles:

        <ul>
          {skittles}
        </ul>
      </div>
    );
  }

});

module.exports = UserSkittles;
```

### Hooking into model updates to selectively update the state (and the UI)

To intercept the model and collection updates, you can declare `modelDidUpdate` or `collectionDidUpdate`
on the component. Declaring these will entirely prevent the auto-setting to state, so you'll need 
to set the data manually:

```js
modelDidUpdate: function (modelKey) {
  // don't set user data to state for now
  if (modelKey === 'user') {
    return;
  }

  // but do set everything else!
  else {
    var newState = {};
    newState[modelKey] = this.models[modelKey].toJSON();
    this.setState(newState);
  }
}
```

### More examples

Check out the [examples](./examples) folder. (Clone this repo and run locally)


## Changelog

* __1.0.0__ initial release w/ unit tests


## Contributing

Got an idea for making this mixin better? Found a bug? 

Submit an [issue](./issues). Pull requests are welcome. Please ensure that any changes
pass unit tests. (Run `grunt`)


## License

Licensed under MIT.
