import React from 'react'
import { useVersionInfo } from '@sensenet/hooks-react'
import { Button, createStyles, Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core'
import logo from '../../assets/sensenet-icon-32.png'
import { StaticWidget } from '../../services/PersonalSettings'

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

export const SubscriptionWidget: React.FunctionComponent<StaticWidget> = (props) => {
  const classes = useStyles()
  const inheritedClasses = props.classes
  const { hasUpdates, versionInfo } = useVersionInfo()

  return (
    <div className={inheritedClasses.root}>
      <Typography variant="h2" title="Your subscription plan" gutterBottom={true} className={inheritedClasses.title}>
        Your subscription plan
      </Typography>
      <Grid container justify="space-between" component={Paper} elevation={0} className={inheritedClasses.container}>
        <Grid item xs={12} lg="auto" className={classes.statusBox}>
          <img src={logo} alt="logo" />
          <div className={inheritedClasses.subtitle}>Developer plan</div>(Free)
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={inheritedClasses.subtitle}>Features</p>
          <p>3 users</p>
          <p>1000 content</p>
          <p style={{ marginBottom: 0 }}>10 GB storage space</p>
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={inheritedClasses.subtitle}>Version number</p>
          <p>{versionInfo?.Components.find((component) => component.ComponentId === 'SenseNet.Services')?.Version}</p>
          <p>
            {hasUpdates ? (
              <>
                There is a newer version. Update <Link href="#">here</Link>
              </>
            ) : (
              'Your version is up to date'
            )}
          </p>
        </Grid>
        <Grid item xs={12} lg="auto">
          <p className={inheritedClasses.subtitle}>Want to get the full functionality?</p>
          <div style={{ textAlign: 'center' }}>
            <Button color="primary" variant="contained">
              Upgrade
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
