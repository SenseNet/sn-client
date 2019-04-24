import { ILeveledLogEntry, LogLevel } from '@furystack/logging'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React, { useContext, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { EventListFilterContext } from './filter-context'

export const List: React.FunctionComponent<{
  values: Array<ILeveledLogEntry<any>>
  style?: React.CSSProperties
}> = props => {
  const filter = useContext(EventListFilterContext).filter
  const [effectiveValues, setEffectiveValues] = useState<Array<ILeveledLogEntry<any>>>([])
  useEffect(() => {
    setEffectiveValues(
      props.values.filter(value => {
        return (
          (!filter.term || value.message.indexOf(filter.term) !== -1) &&
          (filter.logLevel === undefined || value.level === filter.logLevel)
        )
      }),
    )
  }, [filter, props.values])
  return (
    <div style={props.style}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {effectiveValues.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon style={{ marginRight: 15 }} item={row} />
                  {LogLevel[row.level]}
                </div>
              </TableCell>
              <TableCell>{row.message}</TableCell>
              <TableCell>{JSON.stringify(row.data)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
