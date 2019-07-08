import IconButton from '@material-ui/core/IconButton'
import { shallow } from 'enzyme'
import React from 'react'
import { ActionsCell } from '../src/ContentList/CellTemplates/ActionsCell'

/**
 * ActionCell Component tests
 */
describe('ActionCell component', () => {
  it('Should render without crashing', () => {
    const component = shallow(
      <ActionsCell actions={[]} openActionMenu={() => undefined} content={{ Id: 1, Path: '', Name: '', Type: '' }} />,
    )
    component.unmount()
  })

  it('Should handle on action menu click', done => {
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
    iconButton.props().onClick!({} as any)
  })
})
