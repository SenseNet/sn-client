import CircularProgress from '@material-ui/core/CircularProgress'
import { shallow } from 'enzyme'
import React from 'react'
import { PageComponent } from '../src/components/Page'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('Page component', () => {
  const defaultProps: PageComponent['props'] = {
    onClick: jest.fn(),
    imageIndex: 1,
    image: 'preview',
    elementNamePrefix: 'EL',
    zoomMode: 'fit',
    zoomLevel: 0,
    viewportWidth: 1024,
    viewportHeight: 768,
    showWidgets: true,
    margin: 8,
    fitRelativeZoomLevel: 0,
    version: '1A',
    showWatermark: true,
    activePages: [1],
    documentData: exampleDocumentData,
    page: examplePreviewImageData,
    pollInterval: 0,
    previewAvailable: jest.fn(),
    isPlacingCommentMarker: false,
  }

  it('Should render without crashing', () => {
    const wrapper = shallow(<PageComponent {...defaultProps} />)
    const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount')
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
    expect(componentWillUnmount).toBeCalled()
  })

  it('Should render thumbnails without crashing', () => {
    const wrapper = shallow(
      <PageComponent {...defaultProps} image="thumbnail" showWatermark={false} showWidgets={false} />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render a loader when polling', () => {
    const wrapper = shallow(
      <PageComponent {...defaultProps} page={{ ...examplePreviewImageData, PreviewImageUrl: undefined }} />,
    )
    expect(wrapper.find(CircularProgress).exists()).toBeTruthy()
  })

  it('Should handle onClick event', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<PageComponent {...defaultProps} onClick={onClick} />)
    wrapper
      .find('div')
      .first()
      .simulate('click')
    expect(onClick).toBeCalled()
  })

  it('should handle marker placement', () => {
    const handleMarkerCreation = jest.fn()
    const wrapper = shallow(
      <PageComponent {...defaultProps} handleMarkerCreation={handleMarkerCreation} isPlacingCommentMarker={true} />,
    )
    wrapper
      .find('div')
      .first()
      .simulate('click', { nativeEvent: { offsetX: 10, offsetY: 10 } })
    expect(handleMarkerCreation).toBeCalled()
  })
})
