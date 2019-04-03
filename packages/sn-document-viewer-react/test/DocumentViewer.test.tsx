import { shallow } from 'enzyme'
import React from 'react'
import { DocumentViewerComponent } from '../src/components/DocumentViewer'

/**
 * Tests for the Document Viewer main component
 */
describe('Document Viewer component', () => {
  const defaultProps: DocumentViewerComponent['props'] = {
    documentIdOrPath: 1,
    docViewerError: '',
    hostName: 'host',
    idOrPath: 1,
    isLoading: false,
    pollDocumentData: jest.fn(),
    previewImagesError: '',
    previewState: 1,
    setLocalization: jest.fn(),
    localization: {},
  }

  it('should render without crashing', () => {
    const pollDocumentData = jest.fn()
    const setLocalization = jest.fn()
    const wrapper = shallow(
      <DocumentViewerComponent {...defaultProps} pollDocumentData={pollDocumentData} setLocalization={setLocalization}>
        {'some children'}
      </DocumentViewerComponent>,
    )
    expect(wrapper).toMatchSnapshot()
    expect(pollDocumentData).toBeCalled()
    expect(setLocalization).toBeCalled()
  })

  it('should render a loading component while loading', () => {
    const wrapper = shallow(
      <DocumentViewerComponent {...defaultProps} isLoading={true} documentIdOrPath={0} localization={undefined} />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('should render an error component', () => {
    it('if there were errors while preview generation', () => {
      const wrapper = shallow(<DocumentViewerComponent {...defaultProps} previewState={-2} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('if there were docViewer or preview images error', () => {
      const wrapper = shallow(<DocumentViewerComponent {...defaultProps} docViewerError={'error'} />)
      expect(wrapper).toMatchSnapshot()

      const wrapper2 = shallow(<DocumentViewerComponent {...defaultProps} previewImagesError={'error'} />)
      expect(wrapper2).toMatchSnapshot()
    })
  })

  it('should poll document data and set localization when new documentid is added or when the version changed', () => {
    const pollDocumentData = jest.fn()
    const setLocalization = jest.fn()
    const wrapper = shallow(
      <DocumentViewerComponent {...defaultProps} pollDocumentData={pollDocumentData} setLocalization={setLocalization}>
        {'some children'}
      </DocumentViewerComponent>,
    )
    wrapper.setProps({ documentIdOrPath: 2 })
    expect(pollDocumentData).toBeCalled()
    expect(setLocalization).toBeCalled()

    wrapper.setProps({ version: 2 })
    expect(pollDocumentData).toBeCalled()
    expect(setLocalization).toBeCalled()
  })
})
