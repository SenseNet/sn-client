import { debounce } from '@sensenet/client-utils'
import { Button, createStyles, makeStyles, TextField } from '@material-ui/core'
import Save from '@material-ui/icons/Save'
import React, { useCallback, useRef } from 'react'
import { useSearch } from '../../context/search'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      display: 'flex',
      width: '100%',
      marginLeft: '1em',
      marginBottom: '1rem',
    },
  })
})

const searchDebounceTime = 400

export const SearchBar = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization().search
  const { openDialog } = useDialog()

  const searchInputRef = useRef<HTMLInputElement>()
  const searchState = useSearch()

  const debouncedQuery = useCallback(
    debounce((a: string) => searchState.setTerm(a), searchDebounceTime),
    [searchState.setTerm],
  )

  return (
    <div className={globalClasses.centeredVertical}>
      <div className={classes.root}>
        <TextField
          data-test="input-search"
          helperText={localization.queryHelperText}
          defaultValue={searchState.term}
          fullWidth={true}
          inputRef={searchInputRef}
          onChange={(ev) => {
            debouncedQuery(ev.target.value)
          }}
        />
        <Button
          aria-label={localization.saveQuery}
          style={{ flexShrink: 0 }}
          title={localization.saveQuery}
          onClick={() => {
            // We don't want to save empty queries
            if (!searchState.term) {
              return
            }
            openDialog({
              name: 'save-query',
              props: {
                saveName: `Search results for '${searchState.term}'`,
                filters: { term: searchState.term, filters: searchState.filters },
              },
            })
          }}>
          <Save style={{ marginRight: 8 }} />
          {localization.saveQuery}
        </Button>
      </div>
    </div>
  )
}
