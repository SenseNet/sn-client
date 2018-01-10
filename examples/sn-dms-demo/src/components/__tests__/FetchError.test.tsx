import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FetchError } from '../FetchError';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FetchError message="error" onRetry={() => {
    //
  }} />, div);
});