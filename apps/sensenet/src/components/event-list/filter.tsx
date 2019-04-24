import { LogLevel } from '@furystack/logging'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import { debounce } from '@sensenet/client-utils'
import React from 'react'
import { useContext } from 'react'
import { LocalizationContext } from '../../context'
import { EventListFilterContext } from './filter-context'

export const Filter: React.FunctionComponent<{ style?: React.CSSProperties }> = props => {
  const f = useContext(EventListFilterContext)
  const localization = useContext(LocalizationContext).values.eventList.filter

  const updateTerm = debounce((term: string) => {
    f.setFilter({ ...f.filter, term })
  }, 300)

  return (
    <div style={{ display: 'flex', alignItems: 'bottom', ...props.style }}>
      <TextField
        label={localization.termTitle}
        placeholder={localization.termPlaceholder}
        onChange={ev => updateTerm(ev.target.value)}
      />
      <FormControl style={{ justifyContent: 'flex-end', marginLeft: 15 }}>
        <InputLabel htmlFor="event-log-filter">Level</InputLabel>
        <Select
          inputProps={{ id: 'event-log-filter', name: 'level' }}
          style={{ minWidth: 80 }}
          value={isNaN(f.filter.logLevel as number) ? '' : f.filter.logLevel}
          onChange={ev =>
            ev.target.value === ''
              ? f.setFilter({ ...f.filter, logLevel: undefined })
              : f.setFilter({ ...f.filter, logLevel: ev.target.value as any })
          }>
          <MenuItem value="" selected={true}>
            All
          </MenuItem>
          <MenuItem value={LogLevel.Verbose}>Verbose</MenuItem>
          <MenuItem value={LogLevel.Debug}>Debug</MenuItem>
          <MenuItem value={LogLevel.Information}>Information</MenuItem>
          <MenuItem value={LogLevel.Warning}>Warning</MenuItem>
          <MenuItem value={LogLevel.Error}>Error</MenuItem>
          <MenuItem value={LogLevel.Fatal}>Fatal</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
