import IconButton from '@material-ui/core/IconButton'
import CloudDownload from '@material-ui/icons/CloudDownload'
import React from 'react'
import { DocumentData } from '@sensenet/client-core'
import { useDocumentData, useLocalization } from '../../hooks'

/**
 * Own properties for the Share component
 */
export interface DownloadProps {
  download: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const Download: React.FC<DownloadProps> = (props) => {
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        color="inherit"
        title={localization.download}
        onClick={() => props.download(documentData)}
        id="CloudDownload">
        <CloudDownload />
      </IconButton>
    </div>
  )
}
