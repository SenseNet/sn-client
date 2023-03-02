import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { Print as PrintIcon } from '@material-ui/icons'
import { DocumentData } from '@sensenet/client-core'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: { display: 'inline-block' },
    icon: {},
  })
})

type PrintClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Print component
 */
export interface PrintProps {
  print: (document: DocumentData) => void
  classes?: PrintClassKey
}

/**
 * Component that allows print
 */
export const Print: React.FC<PrintProps> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <IconButton
      className={classes.iconButton}
      color="inherit"
      title={localization.print}
      onClick={() => props.print(documentData)}
      id="Print">
      <PrintIcon className={classes.icon} />
    </IconButton>
  )
}
