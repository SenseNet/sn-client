import { DocumentData } from '@sensenet/client-core'
import { createStyles, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import React from 'react'
import { useDocumentData, useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type ShareClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Own properties for the Share component
 */
export interface ShareProps {
  share: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export const Share: React.FC<ShareProps & { classes?: ShareClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const { documentData } = useDocumentData()
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        color="inherit"
        title={localization.share}
        onClick={() => props.share(documentData)}
        id="Share">
        <ShareIcon className={classes.icon} />
      </IconButton>
    </div>
  )
}
