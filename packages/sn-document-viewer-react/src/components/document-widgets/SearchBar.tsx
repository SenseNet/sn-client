import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search'
import React, { useCallback, useState } from 'react'
import { useLocalization } from '../../hooks'

/**
 * Document widget component for paging
 */
export const SearchBar: React.FC = () => {
  const localization = useLocalization()

  const [searchValue, setSearchValue] = useState('')
  const evaluateSearch = useCallback(() => {
    console.log('Search triggered', searchValue)
  }, [searchValue])

  const handleKeyPress = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === 'Enter') {
        evaluateSearch()
      }
    },
    [evaluateSearch],
  )

  return (
    <Grid container={true} spacing={8} alignItems="center">
      <Grid item={true}>
        <Search />
      </Grid>
      <Grid item={true}>
        <TextField
          type="text"
          placeholder={localization.search}
          onKeyPress={handleKeyPress}
          onSubmit={evaluateSearch}
          onChange={ev => setSearchValue(ev.target.value)}
          inputProps={{ style: { color: 'white' } }}
        />
      </Grid>
    </Grid>
  )
}
