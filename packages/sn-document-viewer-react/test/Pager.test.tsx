import TextField from '@material-ui/core/TextField/TextField'
import { sleepAsync } from '@sensenet/client-utils'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { PagerWidget } from '../src/components/document-widgets/Pager'
import { DocumentDataContext } from '../src/context/document-data'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { exampleDocumentData } from './__Mocks__/viewercontext'

describe('PagerWidget component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<PagerWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Numeric input should update the active page', async () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, updateState, activePages: [5] }}>
        <DocumentDataContext.Provider
          value={{ documentData: { ...exampleDocumentData, pageCount: 10 }, updateDocumentData: jest.fn() }}>
          <PagerWidget />
        </DocumentDataContext.Provider>
      </ViewerStateContext.Provider>,
    )
    const changeValue = (value: number | string) =>
      (wrapper.find(TextField).prop('onChange') as any)({ currentTarget: { value } })
    const getValue = () => wrapper.find(TextField).props().value
    changeValue(5)
    await sleepAsync()
    expect(updateState).toHaveBeenCalled()
    expect(getValue()).toBe(5)

    // NaN
    changeValue('somestring')
    await sleepAsync()
    expect(getValue()).toBe(5)

    // limit min
    changeValue(-5)
    await sleepAsync()
    expect(getValue()).toBe(1)

    // limit max
    changeValue(100)
    await sleepAsync()
    expect(getValue()).toBe(10)
  })

  it('First page should jump to page 1', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#FirstPage').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(1)
  })

  it('NavigateBefore should jump a page back', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#NavigateBefore').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(4)
  })

  it('NavigateNext should jump to the next page', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#NavigateNext').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(6)
  })

  it('Last page should jump to page 10', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#LastPage').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(10)
  })
})
