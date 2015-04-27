A colorpicker for React
---

### usage

``` js
var ColorPickr = require('react-colorpickr');
```

### Usage

```js
var React = require('react');
var ColorPicker = require('react-colorpickr');

var App = React.createClass({
  getInitialState: function() {
    return {
      color: 'rgba(56, 130, 184, 1)'
    };
  },

  onChange: function(color) {
    console.log(color);
  },

  render: function() {
    return (
      <div>
        <ColorPicker
          value={this.state.color}
          onChange={this.onChange} />
      </div>
    );
  }
});
```

### Developing

``` sh
npm install & npm start & open http://127.0.0.1:1337/example/
```

Inspired by https://github.com/wangzuo/react-input-color
