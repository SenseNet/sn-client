import { DocumentData } from '@sensenet/client-core'
import IconButton from '@material-ui/core/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloudDownload from '@material-ui/icons/CloudDownload'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: { display: 'inline-block' },
    icon: {},
  })
})

type DownloadClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Download component
 */
export interface DownloadProps {
  download: (document: DocumentData) => void
  classes?: DownloadClassKey
}

/**
 * Component that allows download
 */
export const Download: React.FC<DownloadProps> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <IconButton
      className={classes.iconButton}
      color="inherit"
      title={localization.download}
      onClick={() => props.download(documentData)}
      id="CloudDownload">
      <CloudDownload className={classes.icon} />
    </IconButton>
  )
}
