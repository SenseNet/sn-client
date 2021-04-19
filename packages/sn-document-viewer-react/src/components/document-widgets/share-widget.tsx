import { DocumentData } from '@sensenet/client-core'
import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { Share as ShareIcon } from '@material-ui/icons'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: { display: 'inline-block' },
    icon: {},
  })
})

type ShareClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Share component
 */
export interface ShareProps {
  share: (document: DocumentData) => void
  classes?: ShareClassKey
}

/**
 * Component that allows sharing
 */
export const Share: React.FC<ShareProps> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <IconButton
      className={classes.iconButton}
      color="inherit"
      title={localization.share}
      onClick={() => props.share(documentData)}
      id="Share">
      <ShareIcon className={classes.icon} />
    </IconButton>
  )
}
