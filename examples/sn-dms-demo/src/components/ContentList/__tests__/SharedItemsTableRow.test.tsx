import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SharedItemsTableRow } from '../SharedItemsTableRow';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SharedItemsTableRow currentId={1} />, div);
});