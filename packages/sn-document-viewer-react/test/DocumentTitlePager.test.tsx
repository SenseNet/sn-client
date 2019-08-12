import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { sleepAsync } from '@sensenet/client-utils'
import { shallow } from 'enzyme'
import React from 'react'
import { DocumentTitlePagerComponent } from '../src/components/document-widgets/DocumentTitlePager'

describe('DocumentTitlePager component', () => {
  it('Should render the unfocused state without crashing', () => {
    const wrapper = shallow(
      <DocumentTitlePagerComponent
        activePages={[1]}
        documentName="TestDocument"
        gotoPage="goto"
        pageCount={10}
        setActivePages={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the focused state without crashing', async () => {
    const wrapper = shallow(
      <DocumentTitlePagerComponent
        activePages={[1]}
        documentName="TestDocument"
        gotoPage="goto"
        pageCount={10}
        setActivePages={jest.fn()}
      />,
    )
    wrapper.find(Typography).simulate('click')
    expect(wrapper.find(TextField)).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Should set the default value of the textfield when changed', async () => {
    const activePages = jest.fn()
    const wrapper = shallow(
      <DocumentTitlePagerComponent
        activePages={[1]}
        documentName="TestDocument"
        gotoPage="goto"
        pageCount={10}
        setActivePages={activePages}
      />,
    )
    wrapper.find(Typography).simulate('click')
    const onChange = wrapper.find(TextField).prop('onChange')
    onChange && onChange({ currentTarget: { value: '3' } } as any)
    await sleepAsync()
    expect(activePages).toBeCalled()
  })
})
