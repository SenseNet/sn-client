import { Button, createStyles, Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import logo from '../../assets/sensenet-icon-32.png'
import { useLocalization } from '../../hooks'
import { DashboardSubscription, DashboardVersion } from './types'
import { useWidgetStyles } from '.'

const useStyles = makeStyles(() => {
  return createStyles({
    statusBox: {
      textAlign: 'center',
      alignSelf: 'center',
    },
    link: {
      marginTop: '2rem',
      textAlign: 'center',
    },
  })
})

interface SubscriptionWidgetProps {
  subscription: DashboardSubscription
  version: DashboardVersion
}

export const SubscriptionWidget: React.FunctionComponent<SubscriptionWidgetProps> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().dashboard

  const { limitations } = props.subscription.plan
  const numberFormatter = new Intl.NumberFormat('en-US')

  return (
    <div className={widgetClasses.root}>
      <Typography variant="h2" gutterBottom={true} className={widgetClasses.title}>
        {localization.subscriptionPlan}
      </Typography>
      <Grid container justify="space-between" component={Paper} elevation={0} className={widgetClasses.container}>
        <Grid item xs={12} lg="auto" className={classes.statusBox}>
          <img src={logo} alt="logo" />
          <div className={widgetClasses.subtitle}>{props.subscription.plan.name}</div>(Free)
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={widgetClasses.subtitle}>{localization.features}</p>
          <p>
            {numberFormatter.format(limitations.user)} {localization.users}
          </p>
          <p>
            {numberFormatter.format(limitations.content)} {localization.content}
          </p>
          <p style={{ marginBottom: 0 }}>
            {numberFormatter.format(limitations.storage)} {localization.storageSpace}
          </p>
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={widgetClasses.subtitle}>{localization.version}</p>
          <p>{props.version.title}</p>
          <p>
            <Link href="https://community.sensenet.com/updates/" target="_blank">
              {localization.releaseNotes}
            </Link>
          </p>
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={widgetClasses.subtitle}>{localization.getMore}</p>
          <div style={{ textAlign: 'center' }}>
            <Link href="https://snaas-profile.test.sensenet.com/" target="_blank" underline="none">
              <Button color="primary" variant="contained">
                {localization.upgrade}
              </Button>
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
