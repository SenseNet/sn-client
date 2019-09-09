import IconButton from '@material-ui/core/IconButton'
import PrintIcon from '@material-ui/icons/Print'
import React from 'react'
import { DocumentData } from '../../models'
import { useDocumentData, useLocalization } from '../../hooks'

/**
 * Own properties for the Print component
 */
export interface PrintProps {
  print: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const Print: React.FC<PrintProps> = props => {
  const localization = useLocalization()
  const document = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton color="inherit" title={localization.print} onClick={() => props.print(document)} id="Print">
        <PrintIcon />
      </IconButton>
    </div>
  )
}
