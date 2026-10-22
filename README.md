A colorpicker for React
---

[![npm version](http://img.shields.io/npm/v/@mapbox/react-colorpickr.svg)](https://npmjs.org/package/@mapbox/react-colorpickr)

__[Demo](https://labs.mapbox.com/react-colorpickr/)__

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

By default, react-colorpickr depends on [Assembly](https://labs.mapbox.com/assembly/) and the CSS located in [`dist/colorpickr.css`](./example/colorpickr.css). You can however, override it thanks to [react-themeable](https://github.com/markdalgleish/react-themeable) which react-colorpickr uses internally. See the properties used and the class name values in [`theme.ts`](./src/theme.ts).

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

Pull Requests merged to `main` with conventional commit prefixes are automatically published to npm by the `NPM release` GitHub Actions workflow, as new major/minor/patch versions (`feat!:`/`feat:`/`fix:` respectively). When using "Squash and merge", ensure your PR title includes the conventional commit prefix; a `BREAKING CHANGE:` footer only counts if it ends up in the squash commit's body. Other prefixes (`chore:`, `docs:`, etc.) or no prefix don't trigger a release.

Examples:
- `fix: resolved issue with dropdowns` -> patch
- `feat: added dropdowns` -> minor
- `feat!: Overhauled dropdowns` (requires manual migration work) -> major

The workflow publishes via [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC), so no npm token is needed. This requires an npm org admin to configure a trusted publisher for `@mapbox/react-colorpickr` (GitHub Actions, workflow `npm-release.yml`, environment `npm-release`), and the `npm-release` GitHub Environment to exist in this repository. After publishing, the workflow creates a GitHub Release with generated notes and comments the released version on the merged PRs.

Every push to `main` also deploys the demo site, including changes that don't release a new version: first to labs staging, then to https://labs.mapbox.com/react-colorpickr/. A manual run of the workflow on another branch publishes a prerelease and deploys the demo to labs staging only.

`package.json`'s `version` may be incremented manually if needed (for example, to skip a minor version), but you shouldn't normally need to touch it; the published npm version, not `package.json`, is the source of truth for what gets released next.

### Pre-release versions on other branches

For testing in downstream projects, you can manually trigger the "NPM release" workflow on a branch to publish a pre-release tagged with the short commit sha (e.g. `10.4.0-aa79c6a`) under the npm `prerelease` dist-tag, without affecting `latest`. Check the workflow results for the published version.
