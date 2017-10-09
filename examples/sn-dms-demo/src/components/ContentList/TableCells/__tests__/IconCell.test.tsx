import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IconCell } from '../IconCell';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IconCell
        id={1}
        icon='edit'
        handleRowDoubleClick={() => { }}
        handleRowSingleClick={() => { }} />, div);
});