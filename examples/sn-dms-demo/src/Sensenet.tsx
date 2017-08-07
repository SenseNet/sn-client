import * as React from 'react';
import './Sensenet.css';

const logo = require('./assets/logo.png');

class Sensenet extends React.Component<{}, {}> {
  render() {
    return (
      <div className='Sensenet'>
        <div className='Sensenet-header'>
          <img src={logo} className='Sensenet-logo' alt='logo' />
          <h2>Welcome to sensenet ECM Document Management demo with React</h2>
        </div>
        <p className='Sensenet-intro'>
          Under construction
        </p>
      </div>
    );
  }
}

export default Sensenet;
