import { createStyles, Grid, LinearProgress, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useLocalization } from '../../hooks'
import { DashboardLimitations } from './types'
import { round, useWidgetStyles } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    progress: {
      height: '12px',
      borderRadius: '8px',
      marginBottom: '4px',
      backgroundColor: theme.palette.grey[200],
    },
    progressCaption: {
      color: theme.palette.text.disabled,
    },
    warning: {
      '& .MuiLinearProgress-bar': {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    danger: {
      '& .MuiLinearProgress-bar': {
        backgroundColor: theme.palette.error.main,
      },
    },
  })
})

interface UsageWidgetProps {
  limitations: DashboardLimitations
  used: DashboardLimitations
}

export const UsageWidget: React.FunctionComponent<UsageWidgetProps> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().dashboard
  const { limitations, used } = props

  const userPercentage = (used.user / limitations.user) * 100
  const contentPercentage = (used.content / limitations.content) * 100
  const storagePercentage = (used.storage / limitations.storage) * 100
  const limits = {
    warning: 50,
    danger: 85,
  }
  const numberFormatter = new Intl.NumberFormat('en-US')

  return (
    <div className={widgetClasses.root}>
      <Typography variant="h2" gutterBottom={true} className={widgetClasses.title}>
        {localization.usage}
      </Typography>
      <Paper elevation={0} className={widgetClasses.container}>
        <Grid container style={{ marginBottom: '3rem' }}>
          <Grid item xs={12} sm={3} className={widgetClasses.subtitle}>
            {localization.Users}
          </Grid>
          <Grid item xs={12} sm={9}>
            <LinearProgress
              variant="determinate"
              value={userPercentage > 100 ? 100 : userPercentage}
              className={clsx({
                [classes.progress]: true,
                [classes.warning]: userPercentage >= limits.warning && userPercentage < limits.danger,
                [classes.danger]: userPercentage >= limits.danger,
              })}
            />
            <div className={classes.progressCaption}>
              {localization.used(numberFormatter.format(used.user), numberFormatter.format(limitations.user))}
            </div>
          </Grid>
        </Grid>

        <Grid container style={{ marginBottom: '3rem' }}>
          <Grid item xs={12} sm={3} className={widgetClasses.subtitle}>
            {localization.Content}
          </Grid>
          <Grid item xs={12} sm={9}>
            <LinearProgress
              variant="determinate"
              value={contentPercentage > 100 ? 100 : contentPercentage}
              className={clsx(classes.progress, {
                [classes.warning]: contentPercentage >= limits.warning && contentPercentage < limits.danger,
                [classes.danger]: contentPercentage >= limits.danger,
              })}
            />
            <div className={classes.progressCaption}>
              {localization.used(numberFormatter.format(used.content), numberFormatter.format(limitations.content))}
            </div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={3} className={widgetClasses.subtitle}>
            {localization.StorageSpace}
          </Grid>
          <Grid item xs={12} sm={9}>
            <LinearProgress
              variant="determinate"
              value={storagePercentage > 100 ? 100 : storagePercentage}
              className={clsx(classes.progress, {
                [classes.warning]: storagePercentage >= limits.warning && storagePercentage < limits.danger,
                [classes.danger]: storagePercentage >= limits.danger,
              })}
            />
            <div className={classes.progressCaption}>
              {localization.used(
                numberFormatter.format(round(used.storage / 1024)),
                `${numberFormatter.format(round(limitations.storage / 1024))} GB`,
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
