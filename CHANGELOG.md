## 6.0.0

* Revamps colorpickr layout to a vertical theme.
* This re-theme adds the following react-themeable ids: `controlsLeftContainer`, `controlsRightContainer`, `swatch`, and `swatchCompareContainer`.
* This re-theme removes the following react-themable ids: `topWrapper`, `bottomWrapper`, `bottomContainerLeft`, `newSwatch`, `currentSwatchWrapper`, and `bottomContainerRight`.

## 5.0.0

* Updates codebase to use ES2015 module syntax.
* Updates test framework to use jest
* Uses [react-themeable](https://github.com/markdalgleish/react-themeable) to override component theme by passing a `theme` prop.
* Replaces much of the custom CSS to use [Assembly](https://www.mapbox.com/assembly/).

## 4.3.0

* Support for React 15.

## 4.2.0

* Touch support [#85](https://github.com/mapbox/react-colorpickr/pull/85)

## 4.1.2

* Namespace radio button name on a per component basis [#83](https://github.com/mapbox/react-colorpickr/pull/83)

## 4.1.1

* Fix browserify transforms from being applied to projects using react-colorpickr [#79](https://github.com/mapbox/react-colorpickr/issues/79)
* Move reused code into seperate components. [#78](https://github.com/mapbox/react-colorpickr/pull/78)

## 4.1.1-alpha

* Fix build error when browserifying src/colorpickr

## 4.1.0-alpha

* Now accepts the following color types as props: HSV, HSVA, HSL, HSLA, RGBA, RGBA, HEX, named colors (e.g 'red')

## 3.0.2

* Support React 0.14 and React 0.13

## 3.0.1

* Layout adjustments for Firefox. See [#62](https://github.com/mapbox/react-colorpickr/pull/62).

## 3.0.0

* Break mode switching from `input[type="number"]:focus` into inline radio inputs.
* Labels to denote current/new palette.

## 2.0.5

* Use react-range for input sliders to support IE. See [#52](https://github.com/mapbox/react-colorpickr/pull/52).

## 2.0.0

* Pass `mode` & `colorAttribute` as optional properties to the component.
* Add `mode` & `colorAttribute` values to `onChange`.
* Remove localstorage management of color mode and attributes.

## 1.4.5

* Fix bug around the usage of range inputs, including the darkness range:
  these HTML elements emit values as strings, rather than numbers, so they
  must be parsed before usage.

## 1.4.4

* Fix bug around storage of alpha values: they are now stored as floating
  point numbers between 0 and 1
