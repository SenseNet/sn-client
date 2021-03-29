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
import React from 'react'
import { useWidgetStyles } from '../../globalStyles'
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

export interface ComponentsWidgetProps {
  data: VersionInfo
}

export const ComponentsWidget: React.FunctionComponent<ComponentsWidgetProps> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()
  const localization = useLocalization().settings

  return (
    <div className={widgetClasses.root}>
      <Paper elevation={0} className={widgetClasses.container}>
        <div className={classes.rowContainer}>{localization.components}</div>
        <TableContainer>
          <Table size="small" aria-label="stats-components">
            <TableHead>
              <TableRow>
                <TableCell align="left">{localization.componentId}</TableCell>
                <TableCell align="left">{localization.version}</TableCell>
                <TableCell align="left">{localization.description}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.Components.map((row) => (
                <TableRow key={row.ComponentId}>
                  <TableCell align="left">{row.ComponentId}</TableCell>
                  <TableCell align="left">{row.Version}</TableCell>
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
