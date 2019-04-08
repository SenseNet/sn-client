import Drawer from '@material-ui/core/Drawer'
import { sleepAsync } from '@sensenet/client-utils'
import { shallow } from 'enzyme'
import React from 'react'
import { CreateComment, PageList } from '../src/components'
import CommentComponent from '../src/components/comment/Comment'
import { DocumentViewerLayoutComponent } from '../src/components/DocumentViewerLayout'
import { createdByMock } from './Comment.test'

describe('Document Viewer Layout component', () => {
  const defaultProps: DocumentViewerLayoutComponent['props'] = {
    setActivePages: jest.fn(),
    activePages: [2],
    customZoomLevel: 1,
    fitRelativeZoomLevel: 1,
    setThumbnails: jest.fn(),
    showThumbnails: true,
    showComments: false,
    zoomMode: 'custom',
    comments: [],
    createComment: jest.fn(),
    localization: {} as any,
    setSelectedCommentId: jest.fn(),
    getComments: jest.fn(),
    selectedCommentId: '',
  }
  it('should render without crashing', () => {
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps}>{'some children'}</DocumentViewerLayoutComponent>,
    )
    const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount')
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
    expect(componentWillUnmount).toBeCalled()

    const wrapper2 = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} showThumbnails={false}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    expect(wrapper2).toMatchSnapshot()
  })

  it('should scroll to page when active pages changed', () => {
    const setActivePages = jest.fn()
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} setActivePages={setActivePages} showThumbnails={false}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    wrapper.setProps({ ...defaultProps, activePages: [3], children: '', drawerSlideProps: '', showThumbnails: true })
    expect(setActivePages).toBeCalledWith([3])
  })

  it('should scroll to page when fitRelativeZoomLevel changed', async () => {
    const setActivePages = jest.fn()
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} setActivePages={setActivePages}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    wrapper.setProps({
      ...defaultProps,
      children: '',
      drawerSlideProps: '',
      showThumbnails: false,
      fitRelativeZoomLevel: 2,
    })
    await sleepAsync()
    expect(setActivePages.mock.calls.length).toBe(0)
    const paperProps = wrapper
      .find(Drawer)
      .first()
      .prop('PaperProps')
    expect(paperProps!.style!.width).toBe(0)
  })

  it('click on a page / thumbnail should scroll to the selected page', () => {
    const setActivePages = jest.fn()
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} setActivePages={setActivePages} showThumbnails={false}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )

    wrapper
      .find(PageList)
      .last()
      .prop('onPageClick')({} as any, 3)
    expect(setActivePages).toBeCalledWith([3])

    wrapper
      .find(PageList)
      .first()
      .prop('onPageClick')({} as any, 5)
    expect(setActivePages).toBeCalledWith([5])
  })

  it('should show comments', () => {
    const wrapper = shallow(
      <DocumentViewerLayoutComponent
        {...defaultProps}
        showComments={true}
        comments={[{ id: 'id', page: 1, text: 'some text', createdBy: createdByMock, x: 10, y: 10 }]}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    expect(wrapper.find(CommentComponent).exists()).toBeTruthy()
  })

  it("should remove draft comment markers on CreateComment's handlePlaceMarkerClick", () => {
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} showComments={true}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    wrapper
      .find(PageList)
      .last()
      .prop('handleMarkerCreation')!({ x: 10, y: 10, id: 'id' })
    wrapper.find(CreateComment).prop('handlePlaceMarkerClick')()
    expect(wrapper.state('draftCommentMarker')).toBeUndefined()
  })

  it('should handle comment creation', () => {
    const createComment = jest.fn()
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps} showComments={true} createComment={createComment}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )

    const text = 'this is the comment'
    wrapper.find(CreateComment).prop('createComment')(text)
    expect(createComment).toBeCalledTimes(0) // create comment should not be called when no draft marker is present
    wrapper
      .find(PageList)
      .last()
      .prop('handleMarkerCreation')!({ x: 10, y: 10, id: 'id' })
    wrapper.find(CreateComment).prop('createComment')(text)
    expect(createComment).toBeCalledTimes(1)
    expect(createComment).toBeCalledWith({ page: 1, x: 10, y: 10, id: 'id', text })
  })

  const events: any = {}
  document.addEventListener = jest.fn((event, cb) => {
    events[event] = cb
  })

  it('should handle esc keyup', () => {
    const setSelectedCommentId = jest.fn()
    shallow(
      <DocumentViewerLayoutComponent {...defaultProps} showComments={true} setSelectedCommentId={setSelectedCommentId}>
        {'some children'}
      </DocumentViewerLayoutComponent>,
    )
    events.keyup({ key: 'a' })
    expect(setSelectedCommentId).toBeCalledTimes(0)
    events.keyup({ key: 'Escape' })
    expect(setSelectedCommentId).toBeCalledTimes(1)
    expect(setSelectedCommentId).toBeCalledWith('')
  })
})
