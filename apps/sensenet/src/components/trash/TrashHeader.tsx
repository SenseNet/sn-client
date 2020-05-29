import { TrashBin } from '@sensenet/default-content-types'
import { Grid, IconButton, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

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
        <span style={{ fontSize: '20px' }}>{localization.title}</span>
        <IconButton onClick={() => iconClickHandler()}>
          <Settings />
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
