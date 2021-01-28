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
} from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import { Close, Done } from '@material-ui/icons'
import React from 'react'
import { formatDate } from '../../assets/dateUtils'
import { useGlobalStyles, useWidgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    rowContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
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

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>
          <span>{localization.installedPackages}</span>
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
                  <TableCell align="left">{formatDate(row.ReleaseDate, 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="left" className={globalClasses.centeredHorizontal}>
                    <span>{formatDate(row.ExecutionDate, 'dd/MM/yyyy')}</span>
                    {row.ExecutionResult === 'Successful' ? (
                      <Done style={{ color: green[500] }} />
                    ) : (
                      <Close style={{ color: red[500] }} />
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
