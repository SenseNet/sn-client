import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CompareArrows from '@material-ui/icons/CompareArrows'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import { LeveledLogEntry, LogLevel } from '@sensenet/client-utils'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalization } from '../../hooks'
import { ContentContextService } from '../../services'
import { Icon } from '../Icon'
import { EventListFilterContext } from './filter-context'

type ListProps = {
  values: Array<LeveledLogEntry<any>>
  style?: React.CSSProperties
}

export const List: React.FunctionComponent<ListProps> = props => {
  const { filter } = useContext(EventListFilterContext)
  const repository = useRepository()
  const contextService = new ContentContextService(repository)
  const [effectiveValues, setEffectiveValues] = useState<Array<LeveledLogEntry<any>>>([])
  const localization = useLocalization().eventList.list

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
                {row.data?.relatedContent && row.data?.relatedRepository ? (
                  <Link
                    to={contextService.getPrimaryActionUrl(row.data.relatedContent)}
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon item={row.data.relatedContent} style={{ marginRight: 5 }} />
                    {row.data.relatedContent.DisplayName || row.data.relatedContent.Name}
                  </Link>
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
