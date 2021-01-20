import { DocumentData } from '@sensenet/client-core'
import IconButton from '@material-ui/core/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ShareIcon from '@material-ui/icons/Share'
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
