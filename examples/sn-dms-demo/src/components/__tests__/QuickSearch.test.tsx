import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QuickSearch } from '../QuickSearch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QuickSearch />, div);
});