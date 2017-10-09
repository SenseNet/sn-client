import * as React from 'react';
import * as ReactDOM from 'react-dom';
import QuickSearchInput from '../QuickSearchInput';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QuickSearchInput isOpen={false} onClick={() => {}} />, div);
});