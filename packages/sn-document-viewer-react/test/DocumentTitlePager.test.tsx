import { ObservableValue } from '@sensenet/client-utils'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { DocumentTitlePager } from '../src/components/document-widgets/DocumentTitlePager'
import { DocumentDataContext } from '../src/context/document-data'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
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

  it('Should set pageToGo on blur action', async () => {
    const pageToGo = new ObservableValue({ page: 1 })
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          pageToGo,
        }}>
        <DocumentDataContext.Provider
          value={{
            documentData: {
              ...exampleDocumentData,
              pageCount: 100,
            },
            updateDocumentData: async () => undefined,
            isInProgress: false,
            triggerReload: () => {},
          }}>
          <DocumentTitlePager />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )
    act(() => {
      wrapper.find(Typography).simulate('click')
    })
    act(() => {
      const onBlur = wrapper.update().find(TextField).prop('onBlur')
      onBlur && onBlur({} as any)
    })
    expect(pageToGo.getValue()).toStrictEqual({ page: 1 })
  })

  it('Should set the currentPage with the input number and set pageToGo on blur', async () => {
    const pageToGo = new ObservableValue({ page: 1 })

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          pageToGo,
        }}>
        <DocumentDataContext.Provider
          value={{
            documentData: {
              ...exampleDocumentData,
              pageCount: 100,
            },
            updateDocumentData: async () => undefined,
            isInProgress: false,
            triggerReload: () => {},
          }}>
          <DocumentTitlePager />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )

    act(() => {
      wrapper.find(Typography).simulate('click')
    })

    act(() => {
      wrapper
        .update()
        .find(TextField)
        .props()
        .onChange({ currentTarget: { value: 2 } } as any)
    })

    act(() => {
      const onBlur = wrapper.update().find(TextField).prop('onBlur')
      onBlur && onBlur({} as any)
    })
    expect(pageToGo.getValue()).toStrictEqual({ page: 2 })
  })

  it('Should set the currentPage with the input string and set pageToGo on blur ', async () => {
    const pageToGo = new ObservableValue({ page: 1 })

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          pageToGo,
        }}>
        <DocumentDataContext.Provider
          value={{
            documentData: {
              ...exampleDocumentData,
              pageCount: 100,
            },
            updateDocumentData: async () => undefined,
            isInProgress: false,
            triggerReload: () => {},
          }}>
          <DocumentTitlePager />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )

    act(() => {
      wrapper.find(Typography).simulate('click')
    })

    act(() => {
      wrapper
        .update()
        .find(TextField)
        .props()
        .onChange({ currentTarget: { value: '3' } } as any)
    })

    act(() => {
      const onBlur = wrapper.update().find(TextField).prop('onBlur')
      onBlur && onBlur({} as any)
    })
    expect(pageToGo.getValue()).toStrictEqual({ page: 3 })
  })

  it('Should set the currentPage with the input number and set pageToGo on submit', async () => {
    const pageToGo = new ObservableValue({ page: 1 })

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          pageToGo,
        }}>
        <DocumentDataContext.Provider
          value={{
            documentData: {
              ...exampleDocumentData,
              pageCount: 100,
            },
            updateDocumentData: async () => undefined,
            isInProgress: false,
            triggerReload: () => {},
          }}>
          <DocumentTitlePager />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )

    act(() => {
      wrapper.find(Typography).simulate('click')
    })

    act(() => {
      wrapper
        .update()
        .find(TextField)
        .props()
        .onChange({ currentTarget: { value: 4 } } as any)
    })

    act(() => {
      wrapper.update().find(TextField).simulate('submit')
    })
    expect(pageToGo.getValue()).toStrictEqual({ page: 4 })
  })
})
