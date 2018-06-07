import Checkbox from '@material-ui/core/Checkbox'
import TableHead from '@material-ui/core/TableHead'
import { shallow } from 'enzyme'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ListHead } from '../ListHead'

import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<ListHead />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<ListHead numSelected={1} onRequestSort={() => {
      //
    }} onSelectAllClick={() => {
      //
    }} order="" orderBy="" count={1} />, div)
  })

  it('renders a <TableHead /> component', () => {
    const wrapper = shallow(<ListHead numSelected={1} onRequestSort={() => {
      //
    }} onSelectAllClick={() => {
      //
    }} order="" orderBy="" count={1} />)
    expect(wrapper.find(TableHead)).toHaveLength(1)
  })

  it('renders a <Checkbox /> component', () => {
    const wrapper = shallow(<ListHead numSelected={1} onRequestSort={() => {
      //
    }} onSelectAllClick={() => {
      //
    }} order="" orderBy="" count={1} />)
    expect(wrapper.find(Checkbox)).toHaveLength(1)
  })
})
