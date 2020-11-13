import { sleepAsync } from '@sensenet/client-utils'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { DocumentViewerError, DocumentViewerLoading, DocumentViewerRegeneratePreviews } from '../src'
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

  it('should render a DocumentViewerLoading  component if pageCount=-1', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <DocumentViewer
          documentIdOrPath={1}
          api={{
            getDocumentData: async () => ({
              ...exampleDocumentData,
              pageCount: -1,
            }),
            canEditDocument: async () => true,
            canHideRedaction: async () => true,
            canHideWatermark: async () => true,
          }}
        />,
      )
    })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.update().containsMatchingElement(<DocumentViewerLoading image="loader.gif" />)).toEqual(true)
  })

  it('should render a DocumentViewerRegeneratePreviews component if pageCount =-4', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <DocumentViewer
          {...defaultProps}
          api={{
            getDocumentData: async () => ({
              ...exampleDocumentData,
              pageCount: -4,
            }),
            canEditDocument: async () => true,
            canHideRedaction: async () => true,
            canHideWatermark: async () => true,
          }}
        />,
      )
    })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.update().containsMatchingElement(<DocumentViewerRegeneratePreviews />)).toEqual(true)
  })

  describe('should render DocumentViewerError component', () => {
    it('if there were errors while preview generation and pageCount < 0', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <DocumentViewer
            {...defaultProps}
            api={{
              getDocumentData: async () => ({
                ...exampleDocumentData,
                pageCount: -2,
              }),
              canEditDocument: async () => true,
              canHideRedaction: async () => true,
              canHideWatermark: async () => true,
            }}
          />,
        )
      })
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.update().containsMatchingElement(<DocumentViewerError />)).toEqual(true)
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
})
