import {
  createStyles,
  Divider,
  Grid,
  Hidden,
  Link,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Tooltip,
} from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import jslogo from '../../assets/js.svg'
import dotnetlogo from '../../assets/net.svg'
import reactlogo from '../../assets/react.svg'
import reduxlogo from '../../assets/redux.svg'
import { widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useWidgetStyles = makeStyles(widgetStyles)

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
      margin: '30px 16px 16px',
      cursor: 'pointer',
    },
    apiDocsLink: {
      display: 'inline-block',
      '&:hover': {
        textDecoration: 'none',
      },
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
            <div className={classes.rowContainer}>{localization.apiEndpoint}</div>
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

          <Hidden mdDown>
            <Divider orientation="vertical" flexItem />
          </Hidden>

          <Grid item style={{ padding: '1.5rem' }}>
            <div className={classes.rowContainer}>
              <span>{localization.apiClients}</span>
            </div>
            <div style={{ margin: '0 0 16px 0' }}>{localization.learnAboutApi}</div>
            <Link target="_blank" className={classes.clientLink} href={localization.clientLink}>
              {localization.clientLink}
            </Link>
            <div>
              <Tooltip title="javascript" placement="bottom">
                <Link
                  className={classes.apiDocsLink}
                  target="_blank"
                  href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=js-snclient">
                  <img className={classes.logo} src={jslogo} alt="js-logo" width="35" height="35" />
                </Link>
              </Tooltip>
              <Tooltip title=".net" placement="bottom">
                <Link
                  className={classes.apiDocsLink}
                  target="_blank"
                  href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=dotnet">
                  <img className={classes.logo} src={dotnetlogo} alt="dotnet-logo" width="35" height="35" />
                </Link>
              </Tooltip>
              <Tooltip title="react" placement="bottom">
                <Link
                  className={classes.apiDocsLink}
                  target="_blank"
                  href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=reactjs">
                  <img className={classes.logo} src={reactlogo} alt="react-logo" width="35" height="35" />
                </Link>
              </Tooltip>
              <Tooltip title="redux" placement="bottom">
                <Link
                  className={classes.apiDocsLink}
                  target="_blank"
                  href="https://docs.sensenet.com/api-docs/basic-concepts?chosenLanguage=react-redux">
                  <img className={classes.logo} src={reduxlogo} alt="reduc-logo" width="35" height="35" />
                </Link>
              </Tooltip>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
