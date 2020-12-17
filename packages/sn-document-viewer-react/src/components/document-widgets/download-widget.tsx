import { DocumentData } from '@sensenet/client-core'
import { createStyles, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloudDownload from '@material-ui/icons/CloudDownload'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type DownloadClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Download component
 */
export interface DownloadProps {
  download: (document: DocumentData) => void
}

/**
 * Component that allows download
 */
export const Download: React.FC<DownloadProps & { classes?: DownloadClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        color="inherit"
        title={localization.download}
        onClick={() => props.download(documentData)}
        id="CloudDownload">
        <CloudDownload className={classes.icon} />
      </IconButton>
    </div>
  )
}
