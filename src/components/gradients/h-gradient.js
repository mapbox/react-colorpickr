'use strict';

var React = require('react');

function HGradient({active, hueBackground}) {
  if (!active) {
    return <noscript />;
  }
  return (
    <div>
      <div className='cp-gradient' style={{backgroundColor: hueBackground}} />
      <div className='cp-gradient cp-light-left' />
      <div className='cp-gradient cp-dark-bottom' />
    </div>
  );
}

HGradient.propTypes = {
  active: React.PropTypes.bool.isRequired,
  hueBackground: React.PropTypes.string.isRequired
};

module.exports = HGradient;
