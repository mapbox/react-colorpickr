A colorpicker for React
---

[![npm version](http://img.shields.io/npm/v/@mapbox/react-colorpickr.svg)](https://npmjs.org/package/@mapbox/react-colorpickr) [![Circle CI](https://circleci.com/gh/mapbox/react-colorpickr.svg?style=svg&circle-token=7b6e2687ff5804946f2c0ef5a8a93ad92a4c8ff3)](https://circleci.com/gh/mapbox/react-colorpickr)

__[Demo](https://www.mapbox.com/react-colorpickr/example/)__

## Install

    npm install @mapbox/react-colorpickr

You'll also want to include a copy of [colorpickr.css](https://github.com/mapbox/react-colorpickr/blob/mb-pages/dist/colorpickr.css) in your code.

``` html
<link href='react-colorpickr.css' rel='stylesheet' />
```

## Usage

```js
import React from 'react'
import ColorPicker from '@mapbox/react-colorpickr'

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      color: 'rgba(56, 130, 184, 1)'
    };
  }

  onChange = (color) => {
    console.log(color);
  }

  render() {
    return (
      <ColorPicker value={this.state.color} onChange={this.onChange} />
    )
  }
}
```

## Required properties

#### `onChange`

Value should be a function and is called whenever a color is updated from
the colorpicker. Returns a color object.

## Optional properties

#### `theme`

By default, react-colorpickr depends on [Assembly](https://www.mapbox.com/assembly/) and the CSS located in [`dist/colorpickr.css`](https://github.com/mapbox/react-colorpickr/blob/mb-pages/dist/colorpickr.css). You can however, override it thanks to [react-themeable](https://github.com/markdalgleish/react-themeable) which react-colorpickr uses internally. See the properties used and the class name values under `defaultTheme` in [`src/colorpickr.js`](https://github.com/mapbox/react-colorpickr/blob/assemblify/src/colorpickr.js).

#### `value`

Accepts a string formatted as: HSV, HSVA, HSL, HSLA, RGBA, RGBA, HEX, named colors (e.g 'red').
If this isn't provided, a default color is used.

#### `mode`

Defaults to `rgb`. Initializes which color model tab is active.
Possible options: `hsv`, `rgb`.

#### `colorAttribute`

Defaults to `h`. Initializes which color attribute is active.
Possible options: `h`, `s`, `v`, `r`, `g`, `b`.

#### `reset`

If `reset` is provided as a property with a value of `true` a reset button is
added that when pressed, reverts back to the original color when the
colorpicker is initialized on the page. Defaults to `true`.

## Developing

    npm install & npm start

Inspired by https://github.com/wangzuo/react-input-color
