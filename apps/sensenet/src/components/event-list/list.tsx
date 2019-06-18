import { ILeveledLogEntry, LogLevel } from '@furystack/logging'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CompareArrows from '@material-ui/icons/CompareArrows'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ContentRoutingContext,
  ContentRoutingContextProvider,
  CurrentContentContext,
  RepositoryContext,
} from '../../context'
import { useInjector, useLocalization } from '../../hooks'
import { RepositoryManager } from '../../services/RepositoryManager'
import { Icon } from '../Icon'
import { ContentContextMenu } from '../ContentContextMenu'
import { EventListFilterContext } from './filter-context'

export const List: React.FunctionComponent<{
  values: Array<ILeveledLogEntry<any>>
  style?: React.CSSProperties
}> = props => {
  const { filter } = useContext(EventListFilterContext)
  const [effectiveValues, setEffectiveValues] = useState<Array<ILeveledLogEntry<any>>>([])

  const localization = useLocalization().eventList.list

  const repositoryManager = useInjector().getInstance(RepositoryManager)

  useEffect(() => {
    setEffectiveValues(
      props.values.filter(value => {
        return (
          (!filter.term || value.message.indexOf(filter.term) !== -1) &&
          (!filter.scope || (value.scope && value.scope.indexOf(filter.scope) !== -1)) &&
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
            <TableCell>{localization.level}</TableCell>
            <TableCell>{localization.message}</TableCell>
            <TableCell>{localization.scope}</TableCell>
            <TableCell>{localization.relatedContent}</TableCell>
            <TableCell>{localization.date}</TableCell>
            <TableCell>&nbsp;</TableCell>
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
              <TableCell>{row.scope}</TableCell>
              <TableCell>
                {row.data && row.data.relatedContent && row.data.relatedRepository ? (
                  <RepositoryContext.Provider value={repositoryManager.getRepository(row.data.relatedRepository)}>
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
              <TableCell>{row.data.added}</TableCell>
              <TableCell>
                {row.data.details ? (
                  <Link to={`/events/${row.data.guid}`}>
                    <IconButton>
                      <OpenInNewTwoTone />
                    </IconButton>
                  </Link>
                ) : null}
                {row.data.compare ? (
                  <Link to={`/events/${row.data.guid}`}>
                    <IconButton>
                      <CompareArrows />
                    </IconButton>
                  </Link>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
