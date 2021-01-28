import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { round } from '../dashboard'
import { DashboardData } from '../dashboard/types'

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
    },
  })
})

export const StorageWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const numberFormatter = new Intl.NumberFormat('en-US')
  const repository = useRepository()
  const [data, setData] = useState<DashboardData>()

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, DashboardData>({
        idOrPath: '/Root',
        name: 'GetDashboardData',
        method: 'GET',
        oDataOptions: {
          select: ['Plan'],
        },
      })

      setData(response)
    })()
  }, [repository])

  if (!data) return null

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>
          <span>{localization.storage}</span>
          <span>
            {localization.used(
              `${numberFormatter.format(round(data.usage.storage))} MB`,
              `${numberFormatter.format(round(data.subscription.plan.limitations.storage / 1024))} GB`,
            )}
          </span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.users}</span>
          <span>
            {localization.used(
              numberFormatter.format(data.usage.user),
              numberFormatter.format(data.subscription.plan.limitations.user),
            )}
          </span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.workspaces}</span>
          <span>{numberFormatter.format(data.usage.workspace)}</span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.content}</span>
          <span>
            {localization.used(
              numberFormatter.format(data.usage.content),
              numberFormatter.format(data.subscription.plan.limitations.content),
            )}
          </span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.numberOfRoles}</span>
          <span>{numberFormatter.format(data.usage.group)}</span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.contentTypes}</span>
          <span>{numberFormatter.format(data.usage.contentType)}</span>
        </div>
      </Paper>
    </div>
  )
}
