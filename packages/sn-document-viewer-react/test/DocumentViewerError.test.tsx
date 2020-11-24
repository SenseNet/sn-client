import { mount } from 'enzyme'
import React from 'react'
import { DocumentViewerError } from '../src/components/DocumentViewerError'
import { DocumentDataContext } from '../src/context/document-data'
import { PreviewState } from '../src/Enums'
import { exampleDocumentData } from './__Mocks__/viewercontext'

describe('Document Viewer Error component', () => {
  it('matches snapshot without provided context', () => {
    const wrapper = mount(<DocumentViewerError />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches snapshot with provided context', () => {
    const wrapper = mount(
      <DocumentDataContext.Provider
        value={{
          isInProgress: false,
          documentData: { ...exampleDocumentData, pageCount: PreviewState.UploadFailure, error: ':(' },
          updateDocumentData: async () => undefined,
          triggerReload: () => {},
        }}>
        <DocumentViewerError />
      </DocumentDataContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
