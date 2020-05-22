import React from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { act } from 'react-dom/test-utils'
import { mount, shallow } from 'enzyme'
import { DocumentTitlePager } from '../src/components/document-widgets/DocumentTitlePager'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { DocumentDataContext } from '../src/context/document-data'
import { exampleDocumentData } from './__Mocks__/viewercontext'

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
        <DocumentDataContext.Provider
          value={{
            documentData: {
              ...exampleDocumentData,
              pageCount: 100,
            },
            updateDocumentData: async () => undefined,
          }}>
          <DocumentTitlePager />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )
    act(() => {
      wrapper.find(Typography).simulate('click')
    })
    act(() => {
      const onChange = wrapper.update().find(TextField).prop('onChange')
      onChange && onChange({ currentTarget: { value: '3' } } as any)
    })
    expect(updateState).toBeCalledWith({ activePages: [3] })
  })
})
