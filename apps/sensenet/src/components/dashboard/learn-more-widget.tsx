import React from 'react'
import { createStyles, Grid, Link, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { StaticWidget } from '../../services/PersonalSettings'
import plutoComeBack from '../../assets/dashboard/pluto-come-back-later.png'
import plutoComeBack2x from '../../assets/dashboard/pluto-come-back-later@2x.png'
import plutoOrderCompleted from '../../assets/dashboard/pluto-order-completed.png'
import plutoOrderCompleted2x from '../../assets/dashboard/pluto-order-completed@2x.png'
import plutoWelcome from '../../assets/dashboard/pluto-welcome.png'
import plutoWelcome2x from '../../assets/dashboard/pluto-welcome@2x.png'

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

export const LearnMoreWidget: React.FunctionComponent<StaticWidget> = (props) => {
  const classes = useStyles()
  const inheritedClasses = props.classes

  return (
    <div className={inheritedClasses.root}>
      <Typography variant="h2" title="Learn more about Sensenet" gutterBottom={true} className={inheritedClasses.title}>
        Learn more about Sensenet
      </Typography>
      <Grid
        container
        justify="space-evenly"
        component={Paper}
        elevation={0}
        className={clsx(inheritedClasses.container, classes.container)}>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img
                srcSet={`${plutoOrderCompleted} 1x, ${plutoOrderCompleted2x} 2x`}
                src={plutoOrderCompleted}
                alt="logo"
              />
            </div>
            <p className={clsx(inheritedClasses.subtitle, classes.subtitle)}>Learn the basics</p>
            <div>Get step-by-step guides and learn what you cab achieve only working on the admin-ui.</div>
          </div>
          <div className={classes.link}>
            <Link href="#">View User Guides</Link>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img srcSet={`${plutoComeBack} 1x, ${plutoComeBack2x} 2x`} src={plutoComeBack} alt="logo" />
            </div>
            <p className={clsx(inheritedClasses.subtitle, classes.subtitle)}>Be a content management expert</p>
            <div>Master the concept of sensenet with its special terms and abstractions.</div>
          </div>
          <div className={classes.link}>
            <Link href="#">View Concept Docs</Link>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.item}>
          <div>
            <div className={classes.imageWrapper}>
              <img srcSet={`${plutoWelcome} 1x, ${plutoWelcome2x} 2x`} src={plutoWelcome} alt="logo" />
            </div>
            <p className={clsx(inheritedClasses.subtitle, classes.subtitle)}>Build your first app</p>
            <div>Let us help you to begin your sensenet journey!</div>
          </div>
          <div className={classes.link}>
            <Link href="#">View the Developer manual</Link>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
