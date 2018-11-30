import IconButton from '@material-ui/core/IconButton'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { ActionsCell } from '../../ContentList/CellTemplates/ActionsCell'

/**
 * ActionCell Component tests
 */
export const actionCellTests: Mocha.Suite = describe('ActionCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(
      <ActionsCell actions={[]} openActionMenu={() => undefined} content={{ Id: 1, Path: '', Name: '', Type: '' }} />,
    )
    component.unmount()
  })

  it('Should handle on action menu click', (done: MochaDone) => {
    const component = renderer.create(
      <ActionsCell
        actions={[]}
        openActionMenu={() => {
          done()
          component.unmount()
        }}
        content={{ Id: 1, Path: '', Name: '', Type: '' }}
      />,
    )
    const iconButton = component.root.findAllByType(IconButton)[0]
    iconButton.props.onClick()
  })
})
