import { createStyles, Link, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import plutoSuccess from '../../assets/dashboard/pluto-success-1.png'
import plutoSuccess2x from '../../assets/dashboard/pluto-success-1@2x.png'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { useWidgetStyles } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
      display: 'flex',
      justifyContent: 'space-between',
    },
    textWrapper: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    figure: {
      margin: `0 0 0 ${theme.spacing(4)}px`,
      flexGrow: 1,
      textAlign: 'center',
      alignSelf: 'center',
    },
  })
})

export const YourProjectWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const settings = useContext(ResponsivePersonalSettings)
  const localization = useLocalization().dashboard

  return (
    <div className={widgetClasses.root}>
      <Typography variant="h2" title="Your project" gutterBottom={true} className={widgetClasses.title}>
        {localization.yourProject}
      </Typography>
      <Paper className={clsx(widgetClasses.container, classes.container)} elevation={0}>
        <div className={classes.textWrapper}>
          <p>{localization.getStarted}</p>
          <p>
            Looks like you&apos;re the only user at the moment. Try to{' '}
            <Link
              component={RouterLink}
              to={resolvePathParams({
                path: PATHS.usersAndGroups.appPath,
                params: { browseType: settings.content.browseType },
              })}>
              {' '}
              add more users
            </Link>{' '}
            to manage them and don&apos;t forget to{' '}
            <Link
              component={RouterLink}
              to={resolvePathParams({
                path: PATHS.content.appPath,
                params: { browseType: settings.content.browseType },
              })}>
              create new content
            </Link>{' '}
            as well.
          </p>
        </div>
        <figure className={classes.figure}>
          <img srcSet={`${plutoSuccess} 1x, ${plutoSuccess2x} 2x`} src={plutoSuccess} alt="logo" />
        </figure>
      </Paper>
    </div>
  )
}
