import Drawer from '@material-ui/core/Drawer'
import { sleepAsync } from '@sensenet/client-utils'
import { shallow } from 'enzyme'
import React from 'react'
import { PageList } from '../src/components'
import { DocumentViewerLayoutComponent } from '../src/components/DocumentViewerLayout'

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
  }
  it('should render without crashing', () => {
    const wrapper = shallow(
      <DocumentViewerLayoutComponent {...defaultProps}>{'some children'}</DocumentViewerLayoutComponent>,
    )
    expect(wrapper).toMatchSnapshot()

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
    expect(paperProps.style.width).toBe(0)
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
})
