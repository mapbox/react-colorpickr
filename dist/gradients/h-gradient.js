'use strict';

var React = require('react');

function HGradient(_ref) {
  var active = _ref.active;
  var hueBackground = _ref.hueBackground;

  if (!active) {
    return React.createElement('noscript', null);
  }
  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'cp-gradient', style: { backgroundColor: hueBackground } }),
    React.createElement('div', { className: 'cp-gradient cp-light-left' }),
    React.createElement('div', { className: 'cp-gradient cp-dark-bottom' })
  );
}

HGradient.propTypes = {
  active: React.PropTypes.bool.isRequired,
  hueBackground: React.PropTypes.string.isRequired
};

export HGradient;
