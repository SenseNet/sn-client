import { mount, shallow } from 'enzyme'
import React from 'react'
import { SaveWidget } from '../src/components/document-widgets/SaveWidget'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('SaveDocumentComponent component', () => {
  it('Should render without crashing when has changes', () => {
    const wrapper = shallow(<SaveWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing when there are no changes', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, hasChanges: true }}>
        <SaveWidget />
      </ViewerStateContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a save request when clicked', () => {
    const save = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, hasChanges: true }}>
        <SaveWidget />
      </ViewerStateContext.Provider>,
    )
    wrapper.find('#Save').simulate('click')
    expect(save).toBeCalled()
  })
})
