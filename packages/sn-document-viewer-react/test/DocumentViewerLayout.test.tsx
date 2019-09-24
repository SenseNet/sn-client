import Drawer from '@material-ui/core/Drawer'
import { sleepAsync } from '@sensenet/client-utils'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { CommentsContainer, CreateComment, PageList } from '../src/components'
import { DocumentViewerLayout, DocumentViewerLayoutProps } from '../src/components/DocumentViewerLayout'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { CommentsContext, defaultCommentsContext } from '../src/context/comments'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { CommentStateContext, defaultCommentState } from '../src/context/comment-states'
import { defaultSettings, examplePreviewComment } from './__Mocks__/viewercontext'

declare global {
  interface Window {
    domNode: HTMLDivElement
  }
}

describe('Document Viewer Layout component', () => {
  const defaultProps: DocumentViewerLayoutProps = {}

  beforeAll(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('should match snapshot with default layout', () => {
    const wrapper = shallow(<DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot with thumbnails turned off', () => {
    const wrapper2 = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showThumbnails: false }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    expect(wrapper2).toMatchSnapshot()
  })

  it('should scroll to page when active pages changed', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showThumbnails: false, updateState }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    wrapper.setProps({ ...defaultProps, activePages: [3], children: '', drawerSlideProps: '', showThumbnails: true })
    wrapper.update()
    expect(updateState).toBeCalledWith({ activePages: [3] })
  })

  it('should scroll to page when fitRelativeZoomLevel changed', async () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, updateState }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    wrapper.setProps({
      ...defaultProps,
      children: '',
      drawerSlideProps: '',
      showThumbnails: false,
      fitRelativeZoomLevel: 2,
    })
    await sleepAsync()
    expect(updateState.mock.calls.length).toBe(1)
    const paperProps = wrapper
      .find(Drawer)
      .first()
      .prop('PaperProps')
    expect(paperProps!.style!.width).toBe(0)
  })

  it('click on a page / thumbnail should scroll to the selected page', async () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, updateState, showThumbnails: false }}>
        <DocumentViewerLayout {...defaultProps}> {'some children'}</DocumentViewerLayout>,
      </ViewerStateContext.Provider>,
    )

    wrapper
      .find(PageList)
      .last()
      .prop('onPageClick')({} as any, 3)
    await sleepAsync()
    expect(updateState).toBeCalledWith({ activePages: [3] })

    wrapper
      .find(PageList)
      .first()
      .prop('onPageClick')({} as any, 5)
    expect(updateState).toBeCalledWith({ activePages: [5] })
  })

  it('should show comments', () => {
    const wrapper = mount(
      <CommentsContext.Provider value={{ ...defaultCommentsContext, comments: [examplePreviewComment] }}>
        <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
          <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
        </ViewerStateContext.Provider>
      </CommentsContext.Provider>,
    )
    expect(wrapper.find(CommentsContainer).exists()).toBeTruthy()
  })

  it("should remove draft comment markers on CreateComment's handlePlaceMarkerClick", () => {
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    ;(wrapper.find(PageList).prop('handleMarkerCreation') as any)({ x: 10, y: 10, id: 'id' })
    ;(wrapper.find(CreateComment).prop('handlePlaceMarkerClick') as any)()
    expect(wrapper.state('draftCommentMarker')).toBeUndefined()
  })

  it('should handle comment creation', () => {
    const createComment = jest.fn()
    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider
        value={{
          ...defaultSettings,
          commentActions: { ...defaultSettings.commentActions, addPreviewComment: createComment },
        }}>
        <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
          <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    const text = 'this is the comment'
    wrapper.find(CreateComment).prop('createComment')(text)
    expect(createComment).toBeCalledTimes(0) // create comment should not be called when no draft marker is present
    ;(wrapper
      .find(PageList)
      .last()
      .prop('handleMarkerCreation') as any)({ x: 10, y: 10, id: 'id' })
    ;(wrapper.find(CreateComment).prop('createComment') as any)(text)
    expect(createComment).toBeCalledTimes(1)
    expect(createComment).toBeCalledWith({ page: 1, x: 10, y: 10, id: 'id', text })
  })

  it('should handle comment input value change', async () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )

    const text = 'this is the comment'
    wrapper.find(CreateComment).prop('handleInputValueChange')(text)
    expect(wrapper.state('createCommentValue')).toBe(text)
  })

  it('should handle create comment isActive', () => {
    const updateState = jest.fn()
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true, updateState }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )

    wrapper.find(CreateComment).prop('handleIsActive')(true)
    expect(updateState).toBeCalledTimes(1)
    expect(updateState).toBeCalledWith({ isCreateCommentActive: true })
  })

  const events: any = {}
  document.addEventListener = jest.fn((event, cb) => {
    events[event] = cb
  })

  it('should handle esc keyup', async () => {
    const setActiveComment = jest.fn()

    shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <CommentStateContext.Provider value={{ ...defaultCommentState, setActiveComment }}>
          <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )
    events.keyup({ key: 'a' })
    expect(setActiveComment).toBeCalledTimes(0)
    events.keyup({ key: 'Escape' })
    await sleepAsync()
    expect(setActiveComment).toBeCalledTimes(1)
    expect(setActiveComment).toBeCalledWith('')
  })

  it('should abort commenting when esc was pushed', async () => {
    const updateState = jest.fn()
    shallow(
      <ViewerStateContext.Provider
        value={{ ...defaultViewerState, showComments: true, isCreateCommentActive: true, updateState }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    events.keyup({ key: 'Escape' })
    await sleepAsync()
    expect(updateState).toBeCalled()
  })

  it('should abort marker placement but not commenting when esc was pushed', async () => {
    const updateState = jest.fn()
    shallow(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          showComments: true,
          isCreateCommentActive: true,
          isPlacingCommentMarker: true,
          updateState,
        }}>
        <DocumentViewerLayout {...defaultProps}>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )
    await sleepAsync()
    events.keyup({ key: 'Escape' })
    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: false })
    expect(updateState).not.toBeCalledWith({ isCreateCommentActive: false })
  })

  it('should scroll to comment when selectedCommentId is changed', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(<DocumentViewerLayout {...defaultProps} />, { attachTo: window.domNode })
    expect(scrollToMock).toBeCalled()
  })

  it('should not scroll to comment when comment is not found', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(<DocumentViewerLayout {...defaultProps} />, { attachTo: window.domNode })

    expect(scrollToMock).not.toBeCalled()
  })
})
