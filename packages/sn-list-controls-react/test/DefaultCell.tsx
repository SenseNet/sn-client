import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import { DefaultCell } from '../src/ContentList/CellTemplates/DefaultCell'

/**
 * DefaultCell Component tests
 */
describe('DefaultCell component', () => {
  configure({ adapter: new Adapter() })

  it('Should render without crashing without selected class by default', () => {
    const component = shallow(
      <DefaultCell content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} field={'Type'} isSelected={false} />,
    )
    expect(component.props().className).toBe('')
    component.unmount()
  })

  it('Should add selected class from props', () => {
    const component = shallow(
      <DefaultCell content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} field={'Type'} isSelected={true} />,
    )
    expect(component.props().className).toBe('selected')
    component.unmount()
  })
})
