import { mount, shallow } from 'enzyme'
import React from 'react'
import { sleepAsync } from '@sensenet/client-utils'
import { act } from 'react-dom/test-utils'
import { DocumentViewer, DocumentViewerProps } from '../src/components/DocumentViewer'
import { defaultSettings, exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

/**
 * Tests for the Document Viewer main component
 */
describe('Document Viewer component', () => {
  const defaultProps: DocumentViewerProps = {
    documentIdOrPath: 1,
    theme: {} as any,
  }

  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewer {...defaultProps}>{'some children'}</DocumentViewer>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a loading component while loading', () => {
    const wrapper = shallow(
      <DocumentViewer
        {...defaultProps}
        api={{
          getDocumentData: async () => ({
            ...exampleDocumentData,
            pageCount: -1,
          }),
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('should render an error component', () => {
    it('if there were errors while preview generation', () => {
      const wrapper = shallow(
        <DocumentViewer
          {...defaultProps}
          api={{
            getDocumentData: async () => ({
              ...exampleDocumentData,
              pageCount: -2,
            }),
          }}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })

    it('if an error happens during fetching the document data', () => {
      const wrapper = shallow(
        <DocumentViewer
          {...defaultProps}
          api={{
            getDocumentData: async () => Promise.reject(':('),
          }}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })

    it('if an error happens during fetching the preview image data', () => {
      const wrapper = shallow(
        <DocumentViewer
          {...defaultProps}
          api={{
            getExistingPreviewImages: async () => Promise.reject(':('),
          }}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should fetch the document data and preview images when new documentid is added or when the version changed', async () => {
    await act(async () => {
      const getDocumentData = jest.fn(async () => exampleDocumentData)
      const getExistingPreviewImages = jest.fn(async () => [examplePreviewImageData])
      const wrapper = mount(
        <DocumentViewer
          {...defaultProps}
          api={{
            ...defaultSettings,
            ...defaultProps.api,
            getDocumentData,
            getExistingPreviewImages,
          }}>
          {'some children'}
        </DocumentViewer>,
      )
      wrapper.setProps({ documentIdOrPath: 2, hostName: 'host2', version: 'v2' })
      await sleepAsync(10)
      expect(getDocumentData).lastCalledWith({
        abortController: expect.any(AbortController),
        hostName: 'http://localhost',
        idOrPath: 2,
        version: 'v2',
      }) // ensure that poll document is called with new props
      expect(getExistingPreviewImages).toBeCalled()
    })
  })
})
