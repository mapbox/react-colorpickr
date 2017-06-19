'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class HGradient extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    hueBackground: PropTypes.string.isRequired
  };

  render() {
    const { active, hueBackground } = this.props;
    if (!active) return <noscript />;
    return (
      <div>
        <div className="cp-gradient" style={{ backgroundColor: hueBackground }} />
        <div className="cp-gradient cp-light-left" />
        <div className="cp-gradient cp-dark-bottom" />
      </div>
    );
  }
}

export default HGradient;
