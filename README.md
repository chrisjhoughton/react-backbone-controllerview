# React-Backbone Controller View

A simple mixin to bind Backbone models and collections to React components.

This "controller view" aims to do four things:

* Embrace uni-directional data flow
* Provide a simple declarative approach
* Let you write less code
* Allow for view control

Table of contents:

* [Installation & quick-start](#)
* [Inspiration](#)
* [Usage](#)
* [Changelog](#)
* [Contributing](#)
* [License](#)


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
  // (This is run before mount)
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

React's concept of uni-directional data flow is fantastic. It adds simplicity to applications, 
making it simple to understand and debug.

When integrating Backbone with React, there's a few key challenges & questions:

1. How can I ensure that views update when the model/collection changes?
2. Is it possible to avoid writing `on('change')` and `on('sync')` all over the place?
3. Just which component "owns" the data?

There's a few possible options, such as:

|                                            Option                                            | Advantages |                                                      Disadvantages                                                       |
| -------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Passing the model directly as a `prop`, and using a parent controller around each component. |            | * The component won't automatically hook into model updates and update the views.                                        |
|                                                                                              |            | * If the model is passed to child components, anyone in the hierarchy can update the data. (Breaks uni-directional flow) |
|                                                                                              |            |                                                                                                                          |

1. Passing the model directly as a `prop`, and using a parent controller around each component
2. Declaring the model/collection as a property of a component
3. Setting the model/collection data to state




### 1. Pass the model directly as a `prop`

```js
var user = new Backbone.Model({ name: 'Chris Houghton' });
React.render(<MyComponent user={user} />);
```

In this case, the "parent" of the controller _owns_ the data. Internally within the component,
the model will be referenced directly in the `render` function, and `forceUpdate` will be 
run on hooks.

This method sucks, because:

* `forceUpdate` is discouraged in the [React docs](https://facebook.github.io/react/docs/component-api.html#forceupdate)
* If you pass the model to children, it means that any component in the hierarchy can edit the model. This breaks the concept of uni-directional data flow, and is a great recipe for spaghetti :)
* You have to bind and unbind listeners to the model 


## Usage 


## License
