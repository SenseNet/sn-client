import { shallow } from 'enzyme'
import React from 'react'
import { DocumentViewerErrorComponent, getPreviewState } from '../src/components/DocumentViewerError'
import { defaultLocalization } from '../src/store/Localization'
import { exampleDocumentData } from './__Mocks__/viewercontext'

describe('Document Viewer Error component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewerErrorComponent previewState={0} {...defaultLocalization} error=":(" />)
    expect(wrapper).toMatchSnapshot()

    const wrapper2 = shallow(
      <DocumentViewerErrorComponent
        previewState={0}
        {...defaultLocalization}
        errorLoadingDocument={[{ code: 414, details: 'somestring', message: '', state: -4 }]}
        error={{ status: 405 }}
      />,
    )
    expect(wrapper2).toMatchSnapshot()
  })

  describe('getPreviewState method', () => {
    it('Should set the preview state to 1 when there is a document', () => {
      const state = {
        sensenetDocumentViewer: {
          documentState: {
            document: { ...exampleDocumentData },
            idOrPath: true,
          },
        },
      }
      const previewState = getPreviewState(state as any)
      expect(previewState).toBe(1)
    })

    it('Should set the preview state to -1 when there is no document', () => {
      const state = {
        sensenetDocumentViewer: {
          documentState: {},
        },
      }
      const previewState = getPreviewState(state as any)
      expect(previewState).toBe(-1)
    })
  })
})
