import IconButton from '@material-ui/core/IconButton'
import Print from '@material-ui/icons/Print'
import React, { useContext } from 'react'
import { DocumentData } from '../../models'
import { LocalizationContext } from '../../context/localization-context'
import { DocumentDataContext } from '../../context/document-data'

/**
 * Own properties for the Print component
 */
export interface PrintProps {
  print: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const PrintComponent: React.FC<PrintProps> = props => {
  const localization = useContext(LocalizationContext)
  const document = useContext(DocumentDataContext)
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton color="inherit" title={localization.print} onClick={() => props.print(document)} id="Print">
        <Print />
      </IconButton>
    </div>
  )
}
