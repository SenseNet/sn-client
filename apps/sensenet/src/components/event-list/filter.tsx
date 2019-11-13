import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Delete from '@material-ui/icons/Delete'
import { debounce, LogLevel } from '@sensenet/client-utils'
import React, { useContext } from 'react'

import { useInjector } from '@sensenet/hooks-react'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { EventService } from '../../services/EventService'
import { EventListFilterContext } from './filter-context'

export const Filter: React.FunctionComponent<{ style?: React.CSSProperties }> = props => {
  const f = useContext(EventListFilterContext)
  const service = useInjector().getInstance(EventService)
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
                item={{ message: '', level: f.filter.logLevel }}
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
            .filter(entry => !isNaN(entry[1] as LogLevel))
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
        onClick={() => {
          if (confirm(localization.confirmClear)) {
            service.clear()
          }
        }}>
        <Delete />
      </IconButton>
    </div>
  )
}
