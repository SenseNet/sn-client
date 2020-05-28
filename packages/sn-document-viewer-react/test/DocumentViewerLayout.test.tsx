import { ObservableValue } from '@sensenet/client-utils'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from 'styled-components'
import { Comment, CommentsContainer, CreateComment, PageList } from '../src/components'
import { DocumentViewerLayout } from '../src/components/DocumentViewerLayout'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { CommentStateContext, defaultCommentState } from '../src/context/comment-states'
import { CommentsContext, defaultCommentsContext } from '../src/context/comments'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { defaultTheme } from '../src/models/Theming'
import { PreviewImageDataContextWrapper } from './__Mocks__/preview-image-data-context-wrapper'
import { ViewerStateContextWrapper } from './__Mocks__/viewer-state-context-wrapper'
import { defaultSettings, examplePreviewComment } from './__Mocks__/viewercontext'

declare global {
  interface Window {
    domNode: HTMLDivElement
  }
}

describe('Document Viewer Layout component', () => {
  beforeEach(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('should scroll to page when page changed', () => {
    const onPageChange = new ObservableValue(1)
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(
      <PreviewImageDataContextWrapper>
        <DocumentViewerLayout pagePadding={0} thumbnailPadding={0}>
          {'some children'}
        </DocumentViewerLayout>
      </PreviewImageDataContextWrapper>,
      {
        wrappingComponent: ViewerStateContextWrapper,
        wrappingComponentProps: { onPageChange, showThumbnails: true },
        attachTo: window.domNode,
      },
    )

    onPageChange.setValue(3)
    expect(scrollToMock).toBeCalled()
  })

  it('click on a page / thumbnail should scroll to the selected page', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    const wrapper = mount(
      <PreviewImageDataContextWrapper>
        <DocumentViewerLayout pagePadding={0} thumbnailPadding={0}>
          {'some children'}
        </DocumentViewerLayout>
      </PreviewImageDataContextWrapper>,
      {
        wrappingComponent: ViewerStateContextWrapper,
        attachTo: window.domNode,
      },
    )

    wrapper.find(PageList).last().prop('onPageClick')({} as any, 3)

    expect(scrollToMock).toBeCalled()
  })

  it('should show comments', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <CommentsContext.Provider value={{ ...defaultCommentsContext, comments: [examplePreviewComment] }}>
          <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
            <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
          </ViewerStateContext.Provider>
        </CommentsContext.Provider>,
      )
    })
    expect(wrapper.find(CommentsContainer).exists()).toBeTruthy()
  })

  it('should handle comment creation', async () => {
    const addPreviewComment = function addPreviewComment() {
      return { id: 'someId2', page: 2, text: 'Thats a comment2', x: 20, y: 20, createdBy: {} }
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <DocumentViewerApiSettingsContext.Provider
          value={{
            ...defaultSettings,
            commentActions: { ...defaultSettings.commentActions, addPreviewComment: addPreviewComment as any },
          }}>
          <CommentStateContext.Provider value={{ draft: { id: 'id', x: 10, y: 10 } } as any}>
            <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
              <DocumentViewerLayout />
            </ViewerStateContext.Provider>
          </CommentStateContext.Provider>
        </DocumentViewerApiSettingsContext.Provider>,
      )
    })

    const text = 'this is the comment'
    await act(async () => {
      wrapper.find(CreateComment).prop('createComment')(text)
    })

    // There is already a comment this is why length should be 2
    expect(wrapper.update().find(Comment)).toHaveLength(2)
  })

  it.skip('should handle comment input value change', async () => {
    const wrapper = shallow(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
      </ViewerStateContext.Provider>,
    )

    const text = 'this is the comment'
    wrapper.find(CreateComment).prop('handleInputValueChange')(text)
    expect(wrapper.state('createCommentValue')).toBe(text)
  })

  it('should handle create comment isActive', () => {
    const updateState = jest.fn()
    const wrapper = mount(<DocumentViewerLayout />, {
      wrappingComponent: ViewerStateContextWrapper,
      wrappingComponentProps: { updateState },
    })

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

    mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
        <CommentStateContext.Provider value={{ ...defaultCommentState, setActiveComment }}>
          <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )

    events.keyup({ key: 'a' })
    expect(setActiveComment).toBeCalledTimes(0)
    await act(async () => {
      events.keyup({ key: 'Escape' })
    })

    expect(setActiveComment).toBeCalledTimes(1)
    expect(setActiveComment).toBeCalledWith(undefined)
  })

  it('should abort commenting when esc was pushed', async () => {
    const updateState = jest.fn()
    mount(
      <ThemeProvider theme={defaultTheme}>
        <ViewerStateContext.Provider
          value={{ ...defaultViewerState, showComments: true, isCreateCommentActive: true, updateState }}>
          <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
        </ViewerStateContext.Provider>
      </ThemeProvider>,
    )
    await act(async () => {
      events.keyup({ key: 'Escape' })
    })

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false })
  })

  it('should abort marker placement but not commenting when esc was pushed', async () => {
    const updateState = jest.fn()
    mount(
      <ThemeProvider theme={defaultTheme}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            showComments: true,
            isCreateCommentActive: true,
            isPlacingCommentMarker: true,
            updateState,
          }}>
          <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
        </ViewerStateContext.Provider>
      </ThemeProvider>,
    )
    await act(async () => {
      events.keyup({ key: 'Escape' })
    })
    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: false })
    expect(updateState).not.toBeCalledWith({ isCreateCommentActive: false })
  })

  it.skip('should scroll to comment when selectedCommentId is changed', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(<DocumentViewerLayout />, { attachTo: window.domNode })
    expect(scrollToMock).toBeCalled()
  })

  it.skip('should not scroll to comment when comment is not found', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(<DocumentViewerLayout />, { attachTo: window.domNode })

    expect(scrollToMock).not.toBeCalled()
  })
})
