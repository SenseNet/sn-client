import { VersionInfo } from '@sensenet/hooks-react'
import {
  createStyles,
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
import { green, red } from '@material-ui/core/colors'
import { Close, Done, Info } from '@material-ui/icons'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles, widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'

const useWidgetStyles = makeStyles(widgetStyles)

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      padding: '10px 0',
      fontSize: '16px',
    },
    icon: {
      marginLeft: '12px',
    },
    info: {
      height: '16px',
      width: '16px',
      marginLeft: '6px',
      cursor: 'pointer',
    },
  })
})

export interface InstalledPackagesWidgetProps {
  data: VersionInfo
}

export const InstalledPackagesWidget: React.FunctionComponent<InstalledPackagesWidgetProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings
  const dateUtils = useDateUtils()

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={clsx(globalClasses.centeredVertical, classes.rowContainer)}>
          {localization.installedPackages}
          <Tooltip title={localization.installedPackagesInfo} placement="top">
            <Info className={classes.info} />
          </Tooltip>
        </div>
        <TableContainer>
          <Table size="small" aria-label="stats-components">
            <TableHead>
              <TableRow>
                <TableCell align="left">{localization.componentId}</TableCell>
                <TableCell align="left">{localization.description}</TableCell>
                <TableCell align="left">{localization.releaseDate}</TableCell>
                <TableCell align="left">{localization.executionDate}</TableCell>
                <TableCell align="left">{localization.componentVersion}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.InstalledPackages.map((row) => (
                <TableRow key={row.ComponentId}>
                  <TableCell align="left">{row.ComponentId}</TableCell>
                  <TableCell align="left">{row.Description}</TableCell>
                  <TableCell align="left">{dateUtils.formatDate(row.ReleaseDate, 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="left" className={globalClasses.centeredHorizontal}>
                    <span>{dateUtils.formatDate(row.ExecutionDate, 'dd/MM/yyyy')}</span>
                    {row.ExecutionResult === 'Successful' ? (
                      <Done className={classes.icon} style={{ color: green[500] }} />
                    ) : (
                      <Close className={classes.icon} style={{ color: red[500] }} />
                    )}
                  </TableCell>
                  <TableCell align="left">{row.ComponentVersion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
