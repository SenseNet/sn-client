import IconButton from '@material-ui/core/IconButton'
import CloudDownload from '@material-ui/icons/CloudDownload'
import React, { useContext } from 'react'
import { DocumentData } from '../../models'
import { LocalizationContext } from '../../context/localization-context'
import { DocumentDataContext } from '../../context/document-data'

/**
 * Own properties for the Share component
 */
export interface DownloadProps {
  download: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const Download: React.FC<DownloadProps> = props => {
  const localization = useContext(LocalizationContext)
  const document = useContext(DocumentDataContext)
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        color="inherit"
        title={localization.download}
        onClick={() => props.download(document)}
        id="CloudDownload">
        <CloudDownload />
      </IconButton>
    </div>
  )
}
