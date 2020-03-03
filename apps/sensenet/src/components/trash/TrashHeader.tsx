import React from 'react'
import { Grid, IconButton, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import { TrashBin } from '@sensenet/default-content-types'
import clsx from 'clsx'
import { useLocalization } from '../../hooks'
import { useGlobalStyles } from '../../globalStyles'

type props = { trash: TrashBin; iconClickHandler: () => void }

const TrashHeader: React.FC<props> = ({ trash, iconClickHandler }) => {
  const localization = useLocalization().trash
  const globalClasses = useGlobalStyles()
  const infos = [
    { title: localization.retentionTime, value: trash.MinRetentionTime, unit: localization.retentionTimeUnit },
    { title: localization.sizeQuota, value: trash.SizeQuota, unit: localization.sizeQuotaUnit },
    { title: localization.capacity, value: trash.BagCapacity, unit: localization.capacityUnit },
  ]

  return (
    <Grid
      container={true}
      alignItems="center"
      className={clsx(globalClasses.centeredVertical, globalClasses.contentTitle)}
      style={{ justifyContent: 'space-between' }}>
      <Grid item={true} className={globalClasses.centeredVertical}>
        <Typography variant="h6">{localization.title}</Typography>
        <IconButton onClick={() => iconClickHandler()}>
          <Settings />
        </IconButton>
      </Grid>
      <div className={globalClasses.centeredVertical}>
        {infos.map(info => (
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
