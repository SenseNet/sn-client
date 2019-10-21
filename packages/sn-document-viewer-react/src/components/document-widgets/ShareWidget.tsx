import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import React from 'react'
import { DocumentData } from '../../models'
import { useDocumentData, useLocalization } from '../../hooks'

/**
 * Own properties for the Share component
 */
export interface ShareProps {
  share: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const Share: React.FC<ShareProps> = props => {
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton color="inherit" title={localization.share} onClick={() => props.share(documentData)} id="Share">
        <ShareIcon />
      </IconButton>
    </div>
  )
}
