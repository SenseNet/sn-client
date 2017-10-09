import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DateCell } from '../DateCell';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DateCell
        id={1}
        date='2017-10-05'
        handleRowDoubleClick={() => { }}
        handleRowSingleClick={() => { }} />, div);
});