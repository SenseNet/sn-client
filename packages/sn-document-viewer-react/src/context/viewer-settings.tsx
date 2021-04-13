import { createContext } from 'react'
import { DocumentViewerProps } from '../components/document-viewer'

export const defaultViewerProps: DocumentViewerProps = {
  documentIdOrPath: '',
  renderAppBar: () => null,
}

export const ViewerSettingsContext = createContext<DocumentViewerProps>(defaultViewerProps)
