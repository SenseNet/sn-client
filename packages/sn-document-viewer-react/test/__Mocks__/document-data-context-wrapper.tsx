import React from 'react'
import { DocumentDataContext, DocumentDataContextType } from '../../src/context/document-data'
import { exampleDocumentData } from './viewercontext'

type Props = DocumentDataContextType & { children: React.ReactNode }

export const DocumentDataContextWrapper = (props: Props) => {
  const { documentData, updateDocumentData, children } = props
  return (
    <DocumentDataContext.Provider value={{ documentData, updateDocumentData }}>{children}</DocumentDataContext.Provider>
  )
}

DocumentDataContextWrapper.defaultProps = { documentData: exampleDocumentData, updateDocumentData: () => {} }
