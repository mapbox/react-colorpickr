A colorpicker for React
---

[![npm version](http://img.shields.io/npm/v/@mapbox/react-colorpickr.svg)](https://npmjs.org/package/@mapbox/react-colorpickr)

__[Demo](https://mapbox.github.io/react-colorpickr/)__

## Install

    npm install @mapbox/react-colorpickr

You'll also want to include a copy of [colorpickr.css](./example/colorpickr.css) in your code.

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

By default, react-colorpickr depends on [Assembly](https://mapbox.github.io/assembly/) and the CSS located in [`dist/colorpickr.css`](./example/colorpickr.css). You can however, override it thanks to [react-themeable](https://github.com/markdalgleish/react-themeable) which react-colorpickr uses internally. See the properties used and the class name values in [`theme.ts`](./src/theme.ts).

#### initialValue `string`

Accepts any [valid css color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). If this isn't provided, a default color is used.

#### colorSpace `'hsl' | 'rgb' | 'hex'`

Initializes what should be displaed in the bottom color input. Defaults to `hex`.

#### mode `'disc' | 'values'`

Initializes which view tab is active. Defaults to `disc`.

#### eyedropper `boolean`

When `true`, an eyedropper is added to the top-right of the interface. Defaults to `true`.

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

#### discRadius `number`

Optional property to provide a different disc radius for selection. Helpful if you are re-themeing the interface. Defaults to `18`.


#### readOnly `boolean`

If `true` the colorpicker will render in a readonly state with values clearly shown and selectable, but not editable. Defaults to `false`.

## Developing

    npm install & npm start
    
Then open http://localhost:9966 in browser.

## Publishing

Pull Requests to `main` automatically publish a new version based on the PR's title prefix (`major:`, `minor:` or `patch:`) to the npmjs registry.

Each release also deploys the demo site to GitHub Pages at https://mapbox.github.io/react-colorpickr/ (the `gh-pages` branch). Prereleases don't deploy it.

The published version in the registry is the source of truth for the package version, but you can manually increment the `package.json`'s `version`.

### Pre-release versions on other branches

For testing in downstream projects, you can manually trigger the "NPM release" workflow on a branch to publish a pre-release tagged with the short commit sha (e.g. `10.4.1-aa79c6a` when `10.4.0` is the latest release) under the npm `prerelease` dist-tag, without affecting `latest`. Check the workflow results for the published version.
