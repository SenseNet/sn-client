import { ILeveledLogEntry, LogLevel } from '@furystack/logging'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ContentRoutingContext,
  ContentRoutingContextProvider,
  CurrentContentContext,
  RepositoryContext,
} from '../../context'
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
            <TableCell>Related content</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {effectiveValues.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Icon style={{ marginRight: 15 }} item={row} />
                  {LogLevel[row.level]}
                </div>
              </TableCell>
              <TableCell>{row.message}</TableCell>
              <TableCell>
                {row.data && row.data.relatedContent && row.data.relatedRepository ? (
                  <RepositoryContext.Provider value={row.data.relatedRepository}>
                    <ContentRoutingContextProvider>
                      <ContentRoutingContext.Consumer>
                        {ctx => (
                          <CurrentContentContext.Provider value={row.data.relatedContent}>
                            <Link
                              to={ctx.getPrimaryActionUrl(row.data.relatedContent)}
                              style={{ display: 'flex', alignItems: 'center' }}>
                              <Icon item={row.data.relatedContent} style={{ marginRight: 5 }} />
                              {row.data.relatedContent.DisplayName || row.data.relatedContent.Name}
                            </Link>
                          </CurrentContentContext.Provider>
                        )}
                      </ContentRoutingContext.Consumer>
                    </ContentRoutingContextProvider>
                  </RepositoryContext.Provider>
                ) : null}
              </TableCell>
              <TableCell>
                <IconButton disabled={row.data && row.data.details ? false : true}>
                  <OpenInNewTwoTone />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
