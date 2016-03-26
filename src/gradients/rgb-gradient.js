'use strict';

var React = require('react');

function RGBGradient({color, active, opacityLow, opacityHigh}) {
  if (!active) {
    return <noscript />;
  }
  return (
    <div>
      <div className={`cp-gradient cp-rgb cp-${color}-high`} style={opacityHigh} />
      <div className={`cp-gradient cp-rgb cp-${color}-low`} style={opacityLow} />
    </div>
  );
}

RGBGradient.propTypes = {
  color: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool.isRequired,
  opacityLow: React.PropTypes.number.isRequired,
  opacityHigh: React.PropTypes.number.isRequired
};

module.exports = RGBGradient;