import { returnValueWithUnit } from '@sensenet/controls-react'
import { createStyles, makeStyles, Paper, useTheme } from '@material-ui/core'
import React from 'react'
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

export interface StorageWidgetProps {
  data: DashboardData
}

export const StorageWidget: React.FunctionComponent<StorageWidgetProps> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const theme = useTheme()
  const localization = useLocalization().settings
  const numberFormatter = new Intl.NumberFormat('en-US')

  const allUsage =
    props.data.usage.storage.files +
    props.data.usage.storage.content +
    props.data.usage.storage.oldVersions +
    props.data.usage.storage.log +
    props.data.usage.storage.system

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>
          <span>{localization.storage}</span>
          <span>
            {localization.used(
              returnValueWithUnit(allUsage),
              `${numberFormatter.format(round(props.data.subscription.plan.limitations.storage / 1024))} GB`,
            )}
          </span>
        </div>
        <MultiPartProgressLine
          backgroundColor={theme.palette.type === 'light' ? theme.palette.action.disabled : theme.palette.common.white}
          visualParts={[
            {
              percentage: `${
                allUsage > props.data.usage.storage.available
                  ? (props.data.usage.storage.files / allUsage) * 100
                  : (props.data.usage.storage.files / props.data.usage.storage.available) * 100
              }%`,
              color: '#57c1f7',
              title: localization.files,
            },
            {
              percentage: `${
                allUsage > props.data.usage.storage.available
                  ? (props.data.usage.storage.content / allUsage) * 100
                  : (props.data.usage.storage.content / props.data.usage.storage.available) * 100
              }%`,
              color: '#5bb381',
              title: localization.content,
            },
            {
              percentage: `${
                allUsage > props.data.usage.storage.available
                  ? (props.data.usage.storage.oldVersions / allUsage) * 100
                  : (props.data.usage.storage.oldVersions / props.data.usage.storage.available) * 100
              }%`,
              color: '#e4b34c',
              title: localization.oldVersions,
            },
            {
              percentage: `${
                allUsage > props.data.usage.storage.available
                  ? (props.data.usage.storage.log / allUsage) * 100
                  : (props.data.usage.storage.log / props.data.usage.storage.available) * 100
              }%`,
              color: '#9932CC',
              title: localization.log,
            },
            {
              percentage: `${
                allUsage > props.data.usage.storage.available
                  ? (props.data.usage.storage.system / allUsage) * 100
                  : (props.data.usage.storage.system / props.data.usage.storage.available) * 100
              }%`,
              color: '#A0522D',
              title: localization.system,
            },
          ]}
        />
        <div className={classes.rowContainer}>
          <span>{localization.users}</span>
          <span>
            {localization.used(
              numberFormatter.format(props.data.usage.user),
              numberFormatter.format(props.data.subscription.plan.limitations.user),
            )}
          </span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.workspaces}</span>
          <span>{numberFormatter.format(props.data.usage.workspace)}</span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.content}</span>
          <span>
            {localization.used(
              numberFormatter.format(props.data.usage.content),
              numberFormatter.format(props.data.subscription.plan.limitations.content),
            )}
          </span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.numberOfRoles}</span>
          <span>{numberFormatter.format(props.data.usage.group)}</span>
        </div>
        <div className={classes.rowContainer}>
          <span>{localization.contentTypes}</span>
          <span>{numberFormatter.format(props.data.usage.contentType)}</span>
        </div>
      </Paper>
    </div>
  )
}
