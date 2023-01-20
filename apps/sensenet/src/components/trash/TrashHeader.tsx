import { TrashBin } from '@sensenet/default-content-types'
import { Grid, IconButton, Tooltip, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { PageTitle } from '../PageTitle'

type props = { trash: TrashBin; iconClickHandler: () => void }

const TrashHeader: React.FC<props> = ({ trash, iconClickHandler }) => {
  const { trash: trashLocalization, ...localization } = useLocalization()

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
      className={clsx(globalClasses.centeredVertical)}
      style={{ justifyContent: 'space-between' }}>
      <Grid item={true} className={globalClasses.centeredVertical}>
        <PageTitle title={localization.pageTitles.trash} />
        <Tooltip title={localization.settings.edit}>
          <IconButton onClick={() => iconClickHandler()}>
            <Settings />
          </IconButton>
        </Tooltip>
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
