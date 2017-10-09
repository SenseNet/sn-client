import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FloatingActionButton } from '../FloatingActionButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FloatingActionButton />, div);
});