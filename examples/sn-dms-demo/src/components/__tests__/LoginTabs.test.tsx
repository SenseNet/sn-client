import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    MemoryRouter
} from 'react-router-dom'
import LoginTabs from '../LoginTabs';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><LoginTabs /></MemoryRouter>, div);
});