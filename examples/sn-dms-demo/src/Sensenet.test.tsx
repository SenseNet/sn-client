import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sensenet from './Sensenet';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sensenet />, div);
});
