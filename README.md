A colorpicker for React
---

[![npm version](http://img.shields.io/npm/v/@mapbox/react-colorpickr.svg)](https://npmjs.org/package/@mapbox/react-colorpickr) [![Build Status](https://travis-ci.com/mapbox/react-colorpickr.svg?branch=publisher-production)](https://travis-ci.com/mapbox/react-colorpickr)

__[Demo](https://labs.mapbox.com/react-colorpickr/)__

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

function Example() {
  return (
    <ColorPicker onChange={console.log} />
  )
}
```

## Required properties

#### onChange `(color) => void`

Value should be a function and is called whenever a color is updated from the colorpicker. Returns a color object.

## Optional properties

#### theme `Object<[key: string]: string>`

By default, react-colorpickr depends on [Assembly](https://labs.mapbox.com/assembly/) and the CSS located in [`dist/colorpickr.css`](./example/colorpickr.css). You can however, override it thanks to [react-themeable](https://github.com/markdalgleish/react-themeable) which react-colorpickr uses internally. See the properties used and the class name values in [`theme.js`](./src/theme.js).

#### initialValue `string`

Accepts any [valid css color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). If this isn't provided, a default color is used.

#### mode `'hsl' | 'rgb'`

Initializes which color mode tab is active. Defaults to `hsl`.

#### channel `'h' | 's' | 'l' | 'r' | 'g' | 'b'`

Initializes which color channel is active. Defaults to `h`.

#### reset `boolean`

When `true`, a reset button is added that when pressed, reverts to the initialized color. Defaults to `true`.

#### alpha `boolean`

When `true`, a alpha range slider and input is provided. Defatuls to `true`.

#### mounted `(ColorPickr) => void`

To use internal methods from react-colorpickr, `mounted` provides access to the components instance. This is helpful for calling methods like `overrideValue` that can manually set a new color.

```js
const [instance, setInstance] = useState(null);

const override = () => {
  instance.overrideValue('red');
};

render() {
  <>
    <ColorPickr mounted={picker => setInstance(picker)} onChange={console.log} />
    <button onClick={override}>Override</button>
  </>
}
```

#### `readOnly`

If `true` the colorpicker will render in a readonly state with values clearly shown and selectable, but not editable. Defaults to `false`.

## Developing

    npm install & npm start
    
Then open http://localhost:9966 in browser.
