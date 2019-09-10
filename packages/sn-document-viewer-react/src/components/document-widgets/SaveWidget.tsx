import IconButton from '@material-ui/core/IconButton'
import Save from '@material-ui/icons/Save'
import React, { useCallback } from 'react'
import {
  useDocumentData,
  useDocumentPermissions,
  useDocumentViewerApi,
  useLocalization,
  usePreviewImages,
  useViewerState,
} from '../../hooks'

/**
 * Document widget component for saving document state
 */
export const SaveWidget: React.FC = () => {
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const permissions = useDocumentPermissions()
  const pages = usePreviewImages()
  const viewerState = useViewerState()
  const localization = useLocalization()

  const save = useCallback(() => {
    permissions.canEdit && api.saveChanges({ document, pages: pages.imageData, abortController: new AbortController() })
  }, [api, document, pages, permissions.canEdit])

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        disabled={!viewerState.hasChanges || !permissions.canEdit}
        title={localization.saveChanges}
        onClick={save}
        id="Save">
        <Save />
      </IconButton>
    </div>
  )
}
