import { DocumentData } from '@sensenet/client-core'
import { createStyles, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import PrintIcon from '@material-ui/icons/Print'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type PrintClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Print component
 */
export interface PrintProps {
  print: (document: DocumentData) => void
}

/**
 * Component that allows print
 */
export const Print: React.FC<PrintProps & { classes?: PrintClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        color="inherit"
        title={localization.print}
        onClick={() => props.print(documentData)}
        id="Print">
        <PrintIcon className={classes.icon} />
      </IconButton>
    </div>
  )
}
