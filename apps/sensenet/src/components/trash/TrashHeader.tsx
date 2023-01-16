import { TrashBin } from '@sensenet/default-content-types'
import { createStyles, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import clsx from 'clsx'
import React from 'react'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ButtonTooltip } from '../tooltips/ButtonTooltip'

type props = { trash: TrashBin; iconClickHandler: () => void }

const useStyles = makeStyles(() => {
  return createStyles({
    editTrashButton: {
      textTransform: 'uppercase',
      padding: '2px 7px',
      marginLeft: '10px',
      border: globals.common.grayBorder,
      boxShadow: globals.common.buttonBoxShadow,
      '& .MuiIconButton-label': {
        flexDirection: 'column',
        lineHeight: 1.4,
      },
    },
  })
})

const TrashHeader: React.FC<props> = ({ trash, iconClickHandler }) => {
  const { trash: trashLocalization, ...localization } = useLocalization()

  const classes = useStyles()

  const globalClasses = useGlobalStyles()
  const infos = [
    {
      title: trashLocalization.retentionTime,
      value: trash.MinRetentionTime,
      unit: trashLocalization.retentionTimeUnit,
    },
    { title: trashLocalization.sizeQuota, value: trash.SizeQuota, unit: trashLocalization.sizeQuotaUnit },
    { title: trashLocalization.capacity, value: trash.BagCapacity, unit: trashLocalization.capacityUnit },
  ]

  return (
    <Grid
      container={true}
      alignItems="center"
      className={clsx(globalClasses.centeredVertical, globalClasses.contentTitle)}
      style={{ justifyContent: 'space-between' }}>
      <Grid item={true} className={globalClasses.centeredVertical}>
        <span style={{ fontSize: '20px' }}>{trashLocalization.title}</span>
        <IconButton className={classes.editTrashButton} onClick={() => iconClickHandler()}>
          <Settings />
          <ButtonTooltip title={localization.settings.edit} />
        </IconButton>
      </Grid>
      <div className={globalClasses.centeredVertical}>
        {infos.map((info) => (
          <Grid item={true} key={info.title}>
            <Typography style={{ marginRight: '15px' }}>
              {info.title} : {info.value} {info.unit}
            </Typography>
          </Grid>
        ))}
      </div>
    </Grid>
  )
}

export default TrashHeader
