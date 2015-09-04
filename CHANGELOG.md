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
