import { createStyles, makeStyles } from '@material-ui/core'
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

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type SaveClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component for saving document state
 */
export const SaveWidget: React.FC<{ classes?: SaveClassKey }> = (props) => {
  const classes = useStyles(props)
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const permissions = useDocumentPermissions()
  const pages = usePreviewImages()
  const viewerState = useViewerState()
  const localization = useLocalization()

  const save = useCallback(() => {
    permissions.canEdit &&
      api.saveChanges({
        document: documentData,
        pages: pages.imageData,
        abortController: new AbortController(),
      })
    viewerState.updateState({ hasChanges: false })
  }, [api, documentData, pages.imageData, permissions.canEdit, viewerState])

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        disabled={!viewerState.hasChanges || !permissions.canEdit}
        title={localization.saveChanges}
        onClick={save}
        id="Save">
        <Save className={classes.icon} />
      </IconButton>
    </div>
  )
}
