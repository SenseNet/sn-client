import { useContext } from 'react'
import { DocumentPermissionsContext } from '../context/document-permissions'

export const useDocumentPermissions = () => useContext(DocumentPermissionsContext)
