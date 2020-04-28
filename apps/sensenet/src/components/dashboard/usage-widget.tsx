import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useRepository } from '@sensenet/hooks-react'
import { User } from '@sensenet/default-content-types'
import { createStyles, Grid, LinearProgress, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import { StaticWidget } from '../../services/PersonalSettings'

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

export const UsageWidget: React.FunctionComponent<StaticWidget> = (props) => {
  const [state, setState] = useState({
    userCount: 0,
    contentCount: 0,
  })
  const classes = useStyles()
  const repo = useRepository()
  const inheritedClasses = props.classes

  const userPercentage = (state.userCount / 3) * 100
  const contentPercentage = (state.contentCount / 1000) * 100
  const limits = {
    warning: 50,
    danger: 85,
  }

  useEffect(() => {
    ;(async () => {
      const [users, contents] = await Promise.all([
        repo.loadCollection<User>({
          path: '/Root/IMS/Public',
          oDataOptions: {
            query: "+(TypeIs:'User' AND InTree:'/Root/IMS/Public')",
            inlinecount: 'allpages',
            top: 1,
          },
        }),
        repo.loadCollection<any>({
          path: '/Root/Content',
          oDataOptions: {
            inlinecount: 'allpages',
            top: 1,
            query: "+(InTree:'/Root/Content')",
          },
        }),
      ])

      setState({
        userCount: users.d.__count,
        contentCount: contents.d.__count,
      })
    })()
  }, [repo])

  return (
    <div className={inheritedClasses.root}>
      <Typography variant="h2" title="Current usage" gutterBottom={true} className={inheritedClasses.title}>
        Current usage
      </Typography>
      <Paper elevation={0} className={inheritedClasses.container}>
        <Grid container style={{ marginBottom: '3rem' }}>
          <Grid item xs={12} sm={3} className={inheritedClasses.subtitle}>
            Users
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
            <div className={classes.progressCaption}>{state.userCount} of 3 used</div>
          </Grid>
        </Grid>

        <Grid container style={{ marginBottom: '3rem' }}>
          <Grid item xs={12} sm={3} className={inheritedClasses.subtitle}>
            Content
          </Grid>
          <Grid item xs={12} sm={9}>
            <LinearProgress
              variant="determinate"
              value={contentPercentage > 100 ? 100 : contentPercentage}
              className={clsx({
                [classes.progress]: true,
                [classes.warning]: contentPercentage >= limits.warning && contentPercentage < limits.danger,
                [classes.danger]: contentPercentage >= limits.danger,
              })}
            />
            <div className={classes.progressCaption}>{state.contentCount} of 1000 used</div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={3} className={inheritedClasses.subtitle}>
            Storage space
          </Grid>
          <Grid item xs={12} sm={9}>
            <LinearProgress variant="determinate" value={95} className={classes.progress} />
            <div className={classes.progressCaption}>9.8 of 10GB used</div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
