import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { sleepAsync } from '@sensenet/client-utils'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { DocumentTitlePager } from '../src/components/document-widgets/DocumentTitlePager'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'

describe('DocumentTitlePager component', () => {
  it('Should render the unfocused state without crashing', () => {
    const wrapper = shallow(<DocumentTitlePager />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the focused state without crashing', async () => {
    const wrapper = shallow(<DocumentTitlePager />)
    wrapper.find(Typography).simulate('click')
    expect(wrapper.find(TextField)).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Should set the default value of the textfield when changed', async () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <DocumentTitlePager />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(Typography).simulate('click')
    const onChange = wrapper.find(TextField).prop('onChange')
    onChange && onChange({ currentTarget: { value: '3' } } as any)
    await sleepAsync()
    expect(updateState).toBeCalledWith([3])
  })
})
