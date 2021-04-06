import IconButton from '@material-ui/core/IconButton/IconButton'
import { mount, shallow } from 'enzyme'
import React from 'react'
import {
  AddAnnotationWidget,
  AddHighlightWidget,
  AddRedactionWidget,
  ToggleBase,
  ToggleCommentsWidget,
  ToggleRedactionWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ToggleWatermarkWidget,
} from '../src/components/document-widgets'
import { defaultViewerState, DocumentPermissionsContext, ViewerStateContext } from '../src/context'

describe('Component', () => {
  it('Click on toggle should call setValue with the opposite of isVisible', () => {
    const setValue = jest.fn()
    const wrapper = shallow(<ToggleBase isVisible={false} title="Test" setValue={setValue} />)
    wrapper.find(IconButton).simulate('click')
    expect(setValue).toBeCalledWith(true)
  })

  it('Click on toggle should change the state of showRedaction in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showRedaction: false,
            updateState,
          }}>
          <ToggleRedactionWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ showRedaction: true })
  })

  it('Click on toggle should change the state of showShapes in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showShapes: false,
            updateState,
          }}>
          <ToggleShapesWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ showShapes: true })
  })

  it('Click on toggle should change the state of showThumbnails in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <ToggleThumbnailsWidget />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ showThumbnails: true })
  })

  it('Click on toggle should change the state of showComments in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <ToggleCommentsWidget />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ showComments: true })
  })

  it('Click on toggle should change the state of showWatermark in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            updateState,
          }}>
          <ToggleWatermarkWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ showWatermark: true })
  })

  it('Click on toggle should change the state of activeShapePlacing in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showShapes: false,
            updateState,
          }}>
          <AddAnnotationWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ activeShapePlacing: 'annotation', isPlacingCommentMarker: false })
  })

  it('Click on toggle should change the state of activeShapePlacing in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showShapes: false,
            updateState,
          }}>
          <AddHighlightWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ activeShapePlacing: 'highlight', isPlacingCommentMarker: false })
  })

  it('Click on toggle should change the state of activeShapePlacing in viewer-state provider', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true, canHideWatermark: true, canHideRedaction: true }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showShapes: false,
            updateState,
          }}>
          <AddRedactionWidget />
        </ViewerStateContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )
    wrapper.find(IconButton).simulate('click')

    expect(updateState).toBeCalledWith({ activeShapePlacing: 'redaction', isPlacingCommentMarker: false })
  })
})
