import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { round } from '../dashboard'
import { DashboardData } from '../dashboard/types'
import { MultiPartProgressLine } from './multi-part-progress-line'

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

  const allUsage =
    data.usage.storage.files +
    data.usage.storage.content +
    data.usage.storage.oldVersions +
    data.usage.storage.log +
    data.usage.storage.system

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>
          <span>{localization.storage}</span>
          <span>
            {localization.used(
              `${numberFormatter.format(round(allUsage / 1024 / 1024))} MB`,
              `${numberFormatter.format(round(data.subscription.plan.limitations.storage / 1024))} GB`,
            )}
          </span>
        </div>
        <MultiPartProgressLine
          backgroundColor="white"
          visualParts={[
            {
              percentage: `${
                allUsage > data.usage.storage.available
                  ? (data.usage.storage.files / allUsage) * 100
                  : (data.usage.storage.files / data.usage.storage.available) * 100
              }%`,
              color: '#57c1f7',
              title: 'Files',
            },
            {
              percentage: `${
                allUsage > data.usage.storage.available
                  ? (data.usage.storage.content / allUsage) * 100
                  : (data.usage.storage.content / data.usage.storage.available) * 100
              }%`,
              color: '#5bb381',
              title: 'Content',
            },
            {
              percentage: `${
                allUsage > data.usage.storage.available
                  ? (data.usage.storage.oldVersions / allUsage) * 100
                  : (data.usage.storage.oldVersions / data.usage.storage.available) * 100
              }%`,
              color: '#e4b34c',
              title: 'Old versions',
            },
            {
              percentage: `${
                allUsage > data.usage.storage.available
                  ? (data.usage.storage.log / allUsage) * 100
                  : (data.usage.storage.log / data.usage.storage.available) * 100
              }%`,
              color: '#9932CC',
              title: 'Log',
            },
            {
              percentage: `${
                allUsage > data.usage.storage.available
                  ? (data.usage.storage.system / allUsage) * 100
                  : (data.usage.storage.system / data.usage.storage.available) * 100
              }%`,
              color: '#A0522D',
              title: 'System',
            },
          ]}
        />
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
