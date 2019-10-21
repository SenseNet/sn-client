import { useContext } from 'react'
import { DocumentDataContext } from '../context/document-data'

export const useDocumentData = () => useContext(DocumentDataContext)
