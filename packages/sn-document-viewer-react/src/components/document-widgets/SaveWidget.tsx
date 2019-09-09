import IconButton from '@material-ui/core/IconButton'
import Save from '@material-ui/icons/Save'
import React, { useCallback } from 'react'
import { saveChanges } from '../../store'
import { useDocumentData, useDocumentPermissions, useDocumentViewerApi } from '../../hooks'

/**
 * Document widget component for saving document state
 */
export const SaveDocument: React.FC = () => {
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const permissions = useDocumentPermissions()

  const save = useCallback(() => {
    permissions.canEdit && api.saveChanges(document, this.props.pages)
  }, [api, document, permissions.canEdit])

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        disabled={!this.props.hasChanges || !permissions.canEdit}
        title={saveChanges}
        onClick={save}
        id="Save">
        <Save />
      </IconButton>
    </div>
  )
}
