## 10.0.0 

v10 has been rewritten in TypeScript and has a new layout for better ergnomics and additional features!

### New features

- Larger x/y canvas for color selection
- An input field that accepts additional color spaces than HEX
- And Eyedropper if its supported
- Click to copy functionaliy
- A values mode to dial in channel values
- Bug fixes to address long outstanding issues

### Breaking changes

- `channel` prop is no longer supported
- `mode` has changed to `dial` or `values`
- `colorSpace` replaces what was previously `mode`
- `hexInput` is no longer passed on onChange. 
- The hex input no longer prints the shortend hex equivalent
- A pasted hex input no longer retains a previously set alpha value

## 9.0.5

- [BUG] Drop ternary referencing process.env from source code [#158](https://github.com/mapbox/react-colorpickr/pull/157)

## 9.0.4

- [BUG] Pass existing alpha value on HEX input [#157](https://github.com/mapbox/react-colorpickr/pull/157)

## 9.0.3

- [Fix] Re-publish changes in 9.0.2 because they did not deploy.

## 9.0.2

- [Enhancement] Allow ModeInput to have a disabled state based on a readOnly prop
## 9.0.1

- [Bug] Fix click to select color resulting in drag behavior [#153](https://github.com/mapbox/react-colorpickr/pull/153)

## 9.0.0

- [Breaking] Migrate to Assembly 1.0.0+

## 8.3.0

- [Refactor] Use functional components for most things.
- [Enhancement] Drops leading zero when clearing out a number input. #111
- [Enhancement] Accept hex values where # was pasted or not. #130
- [Addition] adds a alpha option. When set, alpha controls are removed from the picker. #36
- [Bug] Add accessibility to the reset button. #145

## 8.2.0

- [ADDED] Optional boolean parameter to make component readonly. [#144](https://github.com/mapbox/react-colorpickr/pull/144).

## 8.1.2

- [FIX] Accept 0 as a valid alpha channel when passed to `initialValue`. [#128](https://github.com/mapbox/react-colorpickr/pull/128).

## 8.1.1

- [FIX] Support touch handling when both mouse and touch events are present. [#126](https://github.com/mapbox/react-colorpickr/pull/126).

## 8.1.0

- [ADDED] Optional boolean parameter to overrideValue method. When true, `initialValue` used for the reset feature of the colorpicker is also changed.

## 8.0.2

Set expectation that picker always returns valid values

- [FIX] Hex input rejects calling onChange if value is not valid.
- [FIX] Number input returns the max number for each channel if a user input anything above.

## 8.0.1

- [BUG] Store `initialValue` in state so any new value passed to `initialValue` in props does not override.
- [UI] Small layout changes to provide a bit more flexibility to the mode toggle group.
- [BUG] Add a `hexInput` property with boolean value to the object passed from the `onChange` handler. Helpful for detecting if the source of the change derrived from the input which is a little unique from the others. Marking this as a patch change as a version of this existed prior to 8.x.x.

## 8.0.0

- [BREAKING] Dropped `value` prop. Component now exclusively manages its own value state.
- [BREAKING] Renamed `colorAttribute` prop to `channel`.
- [BREAKING] New layout changes. [#118](https://github.com/mapbox/react-colorpickr/pull/118). this has consequences on the
  react-themeable IDs.
- [ADDED] `initialValue` prop. Used as the initial value when the component is first mounted.
- [ADDED] `mounted` prop. Accepts a function that is called when the component mounts with the instance as argument.
- [INTERNAL] Replaced `colr-convert` and `tinycolor2` packages with `color` and `color-string` [#114](https://github.com/mapbox/react-colorpickr/issues/114).
- [INTERNAL] Added `overrideValue` method that can be used when `mounted` is in use.

## 7.0.0

- [BREAKING] Replaced HSV colorspace with HSL. [#110](https://github.com/mapbox/react-colorpickr/pull/110)
- [BREAKING] Layout changes. [#107](https://github.com/mapbox/react-colorpickr/pull/107). This had an effect on the
  react-themeable IDs.
- [BUG] Add isMounted check to prevent the XY component from throwing errors [#109](https://github.com/mapbox/react-colorpickr/pull/109)
- [BUG] Fix restrictions around typing hex characters [#108](https://github.com/mapbox/react-colorpickr/pull/108)
- HSL is now the default option for the component

## 6.1.0

- Allow React 16 as peer dependency.

## 6.0.0

- Revamps colorpickr layout to a vertical theme.
- This re-theme adds the following react-themeable ids: `controlsLeftContainer`, `controlsRightContainer`, `swatch`, and `swatchCompareContainer`.
- This re-theme removes the following react-themable ids: `topWrapper`, `bottomWrapper`, `bottomContainerLeft`, `newSwatch`, `currentSwatchWrapper`, and `bottomContainerRight`.

## 5.0.0

- Updates codebase to use ES2015 module syntax.
- Updates test framework to use jest
- Uses [react-themeable](https://github.com/markdalgleish/react-themeable) to override component theme by passing a `theme` prop.
- Replaces much of the custom CSS to use [Assembly](https://www.mapbox.com/assembly/).

## 4.3.0

- Support for React 15.

## 4.2.0

- Touch support [#85](https://github.com/mapbox/react-colorpickr/pull/85)

## 4.1.2

- Namespace radio button name on a per component basis [#83](https://github.com/mapbox/react-colorpickr/pull/83)

## 4.1.1

- Fix browserify transforms from being applied to projects using react-colorpickr [#79](https://github.com/mapbox/react-colorpickr/issues/79)
- Move reused code into seperate components. [#78](https://github.com/mapbox/react-colorpickr/pull/78)

## 4.1.1-alpha

- Fix build error when browserifying src/colorpickr

## 4.1.0-alpha

- Now accepts the following color types as props: HSV, HSVA, HSL, HSLA, RGBA, RGBA, HEX, named colors (e.g 'red')

## 3.0.2

- Support React 0.14 and React 0.13

## 3.0.1

- Layout adjustments for Firefox. See [#62](https://github.com/mapbox/react-colorpickr/pull/62).

## 3.0.0

- Break mode switching from `input[type="number"]:focus` into inline radio inputs.
- Labels to denote current/new palette.

## 2.0.5

- Use react-range for input sliders to support IE. See [#52](https://github.com/mapbox/react-colorpickr/pull/52).

## 2.0.0

- Pass `mode` & `colorAttribute` as optional properties to the component.
- Add `mode` & `colorAttribute` values to `onChange`.
- Remove localstorage management of color mode and attributes.

## 1.4.5

- Fix bug around the usage of range inputs, including the darkness range:
  these HTML elements emit values as strings, rather than numbers, so they
  must be parsed before usage.

## 1.4.4

- Fix bug around storage of alpha values: they are now stored as floating
  point numbers between 0 and 1
