import { useRepository } from '@sensenet/hooks-react'
import { createStyles, Divider, Grid, Link, makeStyles, Paper, TextField, Theme } from '@material-ui/core'
import React from 'react'
import jslogo from '../../assets/js.png'
import dotnetlogo from '../../assets/net.png'
import reactlogo from '../../assets/react.jpg'
import reduxlogo from '../../assets/redux-logo.png'
import { useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0 16px 0',
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
    logo: {
      margin: '30px 16px',
      cursor: 'pointer',
    },
  })
})

export const ApiEndpointWidget: React.FunctionComponent = () => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const repository = useRepository()

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container} style={{ padding: 0 }}>
        <Grid container spacing={1} style={{ padding: '10px' }}>
          <Grid item xs={12} lg={6} style={{ padding: '1.5rem' }}>
            <div className={classes.rowContainer}>
              <span>{localization.apiEndpoint}</span>
            </div>
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
              value={repository.configuration.identityServerUrl}
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
              <span>{localization.apiClients}</span>
            </div>
            <div style={{ margin: '0 0 16px 0' }}>{localization.learnAboutApi}</div>
            <Link target="_blank" className={classes.clientLink} href={localization.clientLink}>
              {localization.clientLink}
            </Link>
            <div>
              <Link target="_blank" href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=js">
                <img className={classes.logo} src={jslogo} alt="js-logo" width="35" height="35" />
              </Link>
              <Link target="_blank" href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=dotnet">
                <img className={classes.logo} src={dotnetlogo} alt="dotnet-logo" width="35" height="35" />
              </Link>
              <Link target="_blank" href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=react">
                <img className={classes.logo} src={reactlogo} alt="react-logo" width="35" height="35" />
              </Link>
              <Link target="_blank" href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=redux">
                <img className={classes.logo} src={reduxlogo} alt="reduc-logo" width="35" height="35" />
              </Link>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
