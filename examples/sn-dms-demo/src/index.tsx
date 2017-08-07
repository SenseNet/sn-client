import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sensenet from './Sensenet';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Sensenet />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
