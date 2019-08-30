import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { TrashBin } from '@sensenet/default-content-types'
import { useLoadContent } from '../../hooks/use-loadContent'
import { EditPropertiesDialog } from '../dialogs'
import { SimpleList } from '../content/Simple'
import TrashHeader from './TrashHeader'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { padding: theme.spacing(2), margin: theme.spacing(2), height: '100%', width: '100%' },
    title: { display: 'flex', alignItems: 'center' },
    grow: { flexGrow: 1 },
  }),
)

const Trash: React.FC = () => {
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const loadResult = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions: { select: 'all' } })
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {loadResult.content ? (
        <TrashHeader
          iconClickHandler={() => setIsEditPropertiesOpened(!isEditPropertiesOpened)}
          trash={loadResult.content}
        />
      ) : null}
      <SimpleList
        parent="/Root/Trash"
        collectionComponentProps={{
          enableBreadcrumbs: false,
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy'],
        }}
      />
      {loadResult.content ? (
        <EditPropertiesDialog
          content={loadResult.content}
          dialogProps={{
            open: isEditPropertiesOpened,
            onClose: () => setIsEditPropertiesOpened(false),
            keepMounted: false,
          }}
        />
      ) : null}
    </div>
  )
}

export default Trash
