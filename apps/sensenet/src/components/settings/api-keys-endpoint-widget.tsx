import { authenticationService } from '@sensenet/authentication-oidc-react/src/authentication-service'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, Divider, Grid, Link, makeStyles, Paper, TextField, Theme } from '@material-ui/core'
import React from 'react'
import { useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      fontSize: '16px',
    },
    clientLink: {
      color: theme.palette.primary.main,
    },
    input: {
      paddingTop: '10px',
      paddingBottom: '10px',
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    paragraph: {
      padding: '16px 0',
    },
  })
})

export const ApiEndpointWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const repository = useRepository()

  console.log(authenticationService)

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container} style={{ padding: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={6} style={{ padding: '1.5rem' }}>
            <div className={classes.rowContainer}>
              <span>{localization.apiEndpoint}</span>
            </div>
            <div>{localization.apiEndPointSelect}</div>
            <div className={classes.paragraph} />
            <div>{localization.apiEndPointApi}</div>
            <TextField
              name="endpoint"
              variant="outlined"
              fullWidth
              value={repository.configuration.repositoryUrl}
              inputProps={{
                readOnly: true,
                className: classes.input,
              }}
              className={classes.paragraph}
            />
            <div>{localization.apiEndPointIs}</div>
            <TextField
              name="endpoint"
              variant="outlined"
              fullWidth
              value={authenticationService} //TODO: change this
              inputProps={{
                readOnly: true,
                className: classes.input,
              }}
              className={classes.paragraph}
            />
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item style={{ padding: '1.5rem' }}>
            <div className={classes.rowContainer}>
              <span>{localization.downloadSdk}</span>
            </div>
            <div>{localization.sdkText}</div>
            <div style={{ margin: '0 0 16px 0' }}>{localization.sdkText2}</div>
            <Link target="_blank" className={classes.clientLink} href={localization.clientLink}>
              {localization.clientLink}
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
