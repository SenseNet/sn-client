import IconButton from '@material-ui/core/IconButton'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import { ActionsCell } from '../src/ContentList/CellTemplates/ActionsCell'

/**
 * ActionCell Component tests
 */
describe('ActionCell component', () => {
  configure({ adapter: new Adapter() })
  it('Should render without crashing', () => {
    const component = shallow(
      <ActionsCell actions={[]} openActionMenu={() => undefined} content={{ Id: 1, Path: '', Name: '', Type: '' }} />,
    )
    component.unmount()
  })

  it('Should handle on action menu click', (done: jest.DoneCallback) => {
    const component = shallow(
      <ActionsCell
        actions={[]}
        openActionMenu={() => {
          done()
          component.unmount()
        }}
        content={{ Id: 1, Path: '', Name: '', Type: '' }}
      />,
    )
    const iconButton = component.find(IconButton)
    iconButton.props().onClick()
  })
})
