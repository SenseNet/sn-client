import { VersionInfo } from '@sensenet/hooks-react'
import {
  createStyles,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { green, grey, red } from '@material-ui/core/colors'
import { Close, Done, HelpOutline, Info } from '@material-ui/icons'
import React from 'react'
import { useGlobalStyles, useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
    },
    icon: {
      marginLeft: '12px',
    },
    paragraph: {
      marginBottom: '10px',
    },
    link: {
      textDecoration: 'underline',
      marginLeft: '16px',
    },
    info: {
      height: '16px',
      width: '16px',
      marginLeft: '6px',
      cursor: 'pointer',
    },
  })
})

export interface ComponentsWidgetProps {
  data: VersionInfo
}

export const ComponentsWidget: React.FunctionComponent<ComponentsWidgetProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const dateUtils = useDateUtils()

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={globalClasses.centeredVertical} style={{ padding: '10px 0' }}>
          {localization.components}
          <Tooltip title={localization.componentsInfo} placement="top">
            <Info className={classes.info} />
          </Tooltip>
        </div>
        <div className={classes.paragraph}>
          {localization.latestBackendRelease}{' '}
          {props.data.LatestReleases.find((item) => item.ProductName === 'SenseNet.Services') &&
            dateUtils.formatDate(
              props.data.LatestReleases.find((item) => item.ProductName === 'SenseNet.Services')!.ReleaseData,
              'yyyy.MM.dd HH:mm aaa',
            )}
          <Link className={classes.link} href="https://www.sensenet.com/backend-updates" target="_blank" rel="noopener">
            {localization.goToChangeLog}
          </Link>
        </div>
        <div className={classes.paragraph}>
          {localization.latestFrontendRelease}{' '}
          {props.data.LatestReleases.find((item) => item.ProductName === 'SenseNet.AdminUI') &&
            dateUtils.formatDate(
              props.data.LatestReleases.find((item) => item.ProductName === 'SenseNet.AdminUI')!.ReleaseData,
              'yyyy.MM.dd HH:mm aaa',
            )}
          <Link
            className={classes.link}
            href="https://www.sensenet.com/frontend-updates"
            target="_blank"
            rel="noopener">
            {localization.goToChangeLog}
          </Link>
        </div>
        <TableContainer>
          <Table size="small" aria-label="stats-components">
            <TableHead>
              <TableRow>
                <TableCell align="left">{localization.componentId}</TableCell>
                <TableCell align="left">{localization.version}</TableCell>
                <TableCell align="left">{localization.latestOfficialVersion}</TableCell>
                <TableCell align="left">{localization.latest}</TableCell>
                <TableCell align="left">{localization.description}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.Components.map((row) => (
                <TableRow key={row.ComponentId}>
                  <TableCell align="left">{row.ComponentId}</TableCell>
                  <TableCell align="center">{row.Version}</TableCell>
                  <TableCell align="center">{row.LatestVersion || 'N/A'}</TableCell>
                  <TableCell align="center" className={globalClasses.centeredVertical}>
                    {row.LatestVersion !== null ? (
                      row.LatestVersion === row.Version ? (
                        <Done className={classes.icon} style={{ color: green[500] }} />
                      ) : (
                        <Close className={classes.icon} style={{ color: red[500] }} />
                      )
                    ) : (
                      <HelpOutline className={classes.icon} style={{ color: grey[500] }} />
                    )}
                  </TableCell>
                  <TableCell align="left">{row.Description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
