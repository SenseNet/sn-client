import { ObservableValue } from '@sensenet/client-utils'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { CommentsContainer, DocumentViewerLayout, PageList, THUMBNAIL_PADDING, Thumbnails } from '../src/components'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { CommentsContext, defaultCommentsContext } from '../src/context/comments'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { PreviewImageDataContextWrapper } from './__Mocks__/preview-image-data-context-wrapper'
import { ViewerStateContextWrapper } from './__Mocks__/viewer-state-context-wrapper'
import { defaultSettings, examplePreviewComment } from './__Mocks__/viewercontext'

declare global {
  interface Window {
    domNode: HTMLDivElement
  }
}

jest.mock('../src', () => ({
  get THUMBNAIL_PADDING() {
    return THUMBNAIL_PADDING
  },
}))

describe('Document Viewer Layout component', () => {
  beforeEach(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('should scroll to page when page changed', () => {
    const pageToGo = new ObservableValue({ page: 1 })
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    mount(
      <PreviewImageDataContextWrapper>
        <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
      </PreviewImageDataContextWrapper>,
      {
        wrappingComponent: ViewerStateContextWrapper,
        wrappingComponentProps: { pageToGo, showThumbnails: true },
        attachTo: window.domNode,
      },
    )

    pageToGo.setValue({ page: 3 })
    expect(scrollToMock).toBeCalled()
  })

  it('click on a page should scroll to the selected page', async () => {
    const scrollToMock = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    const wrapper = mount(
      <PreviewImageDataContextWrapper>
        <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
      </PreviewImageDataContextWrapper>,
      {
        wrappingComponent: ViewerStateContextWrapper,
        attachTo: window.domNode,
      },
    )

    wrapper.find(PageList).prop('onPageClick')(4)

    expect(scrollToMock).toBeCalled()
  })

  it('click on a thumbnail should scroll to the selected page and change viewerState', async () => {
    const scrollToMock = jest.fn()
    const updateState = jest.fn()
    ;(window as any).HTMLElement.prototype.scrollTo = scrollToMock
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          showThumbnails: true,
          updateState,
        }}>
        <PreviewImageDataContextWrapper>
          <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
        </PreviewImageDataContextWrapper>
      </ViewerStateContext.Provider>,
      {
        wrappingComponent: ViewerStateContextWrapper,
        attachTo: window.domNode,
      },
    )

    wrapper.find(Thumbnails).prop('onPageClick')(6)

    expect(scrollToMock).toBeCalled()
  })

  it('should show comments', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <DocumentViewerApiSettingsContext.Provider
          value={{
            ...defaultSettings,
            commentActions: {
              addPreviewComment: async () => examplePreviewComment,
              deletePreviewComment: async () => {
                return { modified: true }
              },
              getPreviewComments: async () => [examplePreviewComment],
            },
          }}>
          <CommentsContext.Provider value={{ ...defaultCommentsContext, comments: [examplePreviewComment] }}>
            <ViewerStateContext.Provider value={{ ...defaultViewerState, showComments: true }}>
              <DocumentViewerLayout>{'some children'}</DocumentViewerLayout>
            </ViewerStateContext.Provider>
          </CommentsContext.Provider>
        </DocumentViewerApiSettingsContext.Provider>,
      )
    })
    expect(wrapper.find(CommentsContainer).exists()).toBeTruthy()
  })
})
