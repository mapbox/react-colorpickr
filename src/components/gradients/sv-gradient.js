'use strict';

var React = require('react');

function SVGradient({color, active, opacityLow, opacityHigh}) {
  if (!active) {
    return <noscript />;
  }
  return (
    <div>
      <div className={`cp-gradient cp-${color}-high`} style={opacityHigh} />
      <div className={`cp-gradient cp-${color}-low`} style={opacityLow} />
      <div className='cp-gradient cp-dark-bottom' />
    </div>
  );
}

SVGradient.propTypes = {
  color: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool.isRequired,
  opacityLow: React.PropTypes.object.isRequired,
  opacityHigh: React.PropTypes.object.isRequired
};

module.exports = SVGradient;