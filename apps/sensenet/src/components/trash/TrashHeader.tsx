import React from 'react'
import { createStyles, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import { TrashBin } from '@sensenet/default-content-types'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() =>
  createStyles({
    title: { display: 'flex', alignItems: 'center' },
    grow: { flexGrow: 1 },
  }),
)

type props = { trash: TrashBin; iconClickHandler: () => void }

const TrashHeader: React.FC<props> = ({ trash, iconClickHandler }) => {
  const localization = useLocalization().trash
  const classes = useStyles()
  const infos = [
    { title: localization.retentionTime, value: trash.MinRetentionTime },
    { title: localization.sizeQuota, value: trash.SizeQuota },
    { title: localization.capacity, value: trash.BagCapacity },
  ]

  return (
    <Grid container={true} spacing={2} alignItems="center">
      <Grid item={true} className={classes.title}>
        <Typography variant="h5">{localization.title}</Typography>
        <IconButton onClick={() => iconClickHandler()}>
          <Settings />
        </IconButton>
      </Grid>
      <Grid item={true} className={classes.grow} />
      {infos.map(info => (
        <Grid item={true} key={info.title}>
          <Typography>
            {info.title} : {info.value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export default TrashHeader
