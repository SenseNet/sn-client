import { ILeveledLogEntry, LogLevel } from '@furystack/logging'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Delete from '@material-ui/icons/Delete'
import { debounce } from '@sensenet/client-utils'
import { useContext } from 'react'
import React from 'react'
import { useEventService, useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { EventListFilterContext } from './filter-context'

export const Filter: React.FunctionComponent<{ style?: React.CSSProperties }> = props => {
  const f = useContext(EventListFilterContext)
  const service = useEventService()
  const localization = useLocalization().eventList.filter

  const updateTerm = debounce((term: string) => {
    f.setFilter({ ...f.filter, term })
  }, 300)

  const updateScope = debounce((scope: string) => {
    f.setFilter({ ...f.filter, scope })
  }, 300)

  return (
    <div style={{ display: 'flex', alignItems: 'bottom', ...props.style }}>
      <TextField
        label={localization.termTitle}
        placeholder={localization.termPlaceholder}
        onChange={ev => updateTerm(ev.target.value)}
      />
      <TextField
        label={localization.scopeTitle}
        placeholder={localization.scopePlaceholder}
        onChange={ev => updateScope(ev.target.value)}
      />
      <FormControl style={{ justifyContent: 'flex-end', marginLeft: 15 }}>
        <InputLabel htmlFor="event-log-filter">{localization.levelTitle}</InputLabel>
        <Select
          inputProps={{ id: 'event-log-filter', name: 'level' }}
          style={{ minWidth: 80 }}
          startAdornment={
            f.filter.logLevel ? (
              <Icon
                // style={{ marginRight: 9, height: 16 }}
                item={{ message: '', level: f.filter.logLevel } as ILeveledLogEntry<any>}
              />
            ) : null
          }
          value={isNaN(f.filter.logLevel as number) ? '' : f.filter.logLevel}
          renderValue={v => LogLevel[v as any]}
          onChange={ev =>
            ev.target.value === ''
              ? f.setFilter({ ...f.filter, logLevel: undefined })
              : f.setFilter({ ...f.filter, logLevel: ev.target.value as any })
          }>
          <MenuItem value="" selected={true}>
            {localization.levelAll}
          </MenuItem>
          {Object.entries(LogLevel)
            .filter(entry => !isNaN(entry[1]))
            .map(entry => (
              <MenuItem key={entry[1]} value={entry[1]}>
                {entry[0]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <IconButton
        style={{
          padding: '5px',
          margin: '0 0 0 10px',
          alignSelf: 'flex-end',
        }}
        title={localization.clear}
        onClick={() => confirm(localization.confirmClear) && service.clear()}>
        <Delete />
      </IconButton>
    </div>
  )
}
