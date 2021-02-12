import { debounce } from '@sensenet/client-utils'
import { createStyles, IconButton, InputAdornment, makeStyles, TextField, Theme } from '@material-ui/core'
import Bookmark from '@material-ui/icons/Bookmark'
import Cancel from '@material-ui/icons/Cancel'
import React, { useCallback, useRef } from 'react'
import { useSearch } from '../../context/search'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      width: '100%',
      marginLeft: '1em',
      marginBottom: '1rem',
    },
    inputButton: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchState.term && (
                  <IconButton
                    className={classes.inputButton}
                    aria-label={localization.clearTerm}
                    title={localization.clearTerm}
                    onClick={() => null}>
                    <Cancel
                      onClick={() => {
                        if (searchInputRef.current) {
                          searchInputRef.current.value = ''
                        }
                        searchState.setTerm('')
                      }}
                    />
                  </IconButton>
                )}
                <IconButton
                  className={classes.inputButton}
                  aria-label={localization.saveQuery}
                  title={localization.saveQuery}
                  disabled={!searchState.term}
                  onClick={() => {
                    openDialog({
                      name: 'save-query',
                      props: {
                        saveName: `Search results for '${searchState.term}'`,
                        filters: { term: searchState.term, filters: searchState.filters },
                      },
                    })
                  }}>
                  <Bookmark />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  )
}
