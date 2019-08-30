import React, { useState } from 'react'
import { createStyles, Grid, IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { GenericContent, TrashBin } from '@sensenet/default-content-types'
import { Settings } from '@material-ui/icons'
import { useLocalization } from '../hooks'
import { useLoadContent } from '../hooks/use-loadContent'
import { EditPropertiesDialog } from './dialogs'
import { SimpleList } from './content/Simple'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { padding: theme.spacing(2), margin: theme.spacing(2), height: '100%', width: '100%' },
    title: { display: 'flex', alignItems: 'center' },
    grow: { flexGrow: 1 },
  }),
)

const columns: Array<keyof GenericContent> = ['DisplayName', 'ModificationDate', 'ModifiedBy']

const Trash: React.FC = () => {
  const [isEditPropertiesOpened, setIsEditPropertiesOpened] = useState(false)
  const localization = useLocalization().trash
  const trash = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions: { select: 'all' } })
  const classes = useStyles()
  const infos = [
    { title: localization.retentionTime, value: trash.content && trash.content.MinRetentionTime },
    { title: localization.sizeQuota, value: trash.content && trash.content.SizeQuota },
    { title: localization.capacity, value: trash.content && trash.content.BagCapacity },
  ]

  return (
    <div className={classes.root}>
      <Grid container={true} spacing={2} alignItems="center">
        <Grid item={true} className={classes.title}>
          <Typography variant="h5">{localization.title}</Typography>
          <IconButton onClick={() => setIsEditPropertiesOpened(!isEditPropertiesOpened)}>
            <Settings />
          </IconButton>
        </Grid>
        <Grid item={true} className={classes.grow} />
        {trash.content
          ? infos.map(info => (
              <Grid item={true} key={info.title}>
                <Typography>
                  {info.title} : {info.value}
                </Typography>
              </Grid>
            ))
          : null}
      </Grid>
      <SimpleList
        parent="/Root/Trash"
        collectionComponentProps={{ enableBreadcrumbs: false, fieldsToDisplay: columns }}
      />
      {trash.content ? (
        <EditPropertiesDialog
          content={trash.content}
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
