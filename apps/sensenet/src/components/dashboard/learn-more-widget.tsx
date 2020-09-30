import { createStyles, Grid, Link, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import plutoComeBack from '../../assets/dashboard/pluto-come-back-later.png'
import plutoComeBack2x from '../../assets/dashboard/pluto-come-back-later@2x.png'
import plutoOrderCompleted from '../../assets/dashboard/pluto-order-completed.png'
import plutoOrderCompleted2x from '../../assets/dashboard/pluto-order-completed@2x.png'
import plutoWelcome from '../../assets/dashboard/pluto-welcome.png'
import plutoWelcome2x from '../../assets/dashboard/pluto-welcome@2x.png'
import { useLocalization } from '../../hooks'
import { useWidgetStyles } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      padding: '0 !important',
    },
    item: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    imageWrapper: {
      textAlign: 'center',
    },
    subtitle: {
      marginTop: `${theme.spacing(3)}px !important`,
    },
    link: {
      marginTop: '2rem',
      textAlign: 'center',
    },
  })
})

export const LearnMoreWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().dashboard

  return (
    <div className={widgetClasses.root}>
      <Typography variant="h2" title="Learn more about Sensenet" gutterBottom={true} className={widgetClasses.title}>
        {localization.learnMore}
      </Typography>
      <Grid
        container
        justify="space-evenly"
        component={Paper}
        elevation={0}
        className={clsx(widgetClasses.container, classes.container)}>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img
                srcSet={`${plutoOrderCompleted} 1x, ${plutoOrderCompleted2x} 2x`}
                src={plutoOrderCompleted}
                alt="logo"
              />
            </div>
            <p className={clsx(widgetClasses.subtitle, classes.subtitle)}>{localization.learnBasics}</p>
            <div>{localization.learnBasicsDescription}</div>
          </div>
          <div className={classes.link}>
            <Link href="https://docs.sensenet.com/guides/getting-started" target="_blank" rel="noopener">
              {localization.viewUserGuides}
            </Link>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img srcSet={`${plutoComeBack} 1x, ${plutoComeBack2x} 2x`} src={plutoComeBack} alt="logo" />
            </div>
            <p className={clsx(widgetClasses.subtitle, classes.subtitle)}>{localization.beExpert}</p>
            <div>{localization.beExpertDescription}</div>
          </div>
          <div className={classes.link}>
            <Link href="https://docs.sensenet.com/concepts/introduction" target="_blank" rel="noopener">
              {localization.viewConceptDocs}
            </Link>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img srcSet={`${plutoWelcome} 1x, ${plutoWelcome2x} 2x`} src={plutoWelcome} alt="logo" />
            </div>
            <p className={clsx(widgetClasses.subtitle, classes.subtitle)}>{localization.buildApp}</p>
            <div>{localization.buildAppDescription}</div>
          </div>
          <div className={classes.link}>
            <Link href="https://docs.sensenet.com/api-docs/basic-concepts" target="_blank" rel="noopener">
              {localization.viewDevManual}
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
