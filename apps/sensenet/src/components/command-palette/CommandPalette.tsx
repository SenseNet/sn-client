import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { createStyles, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'
import Search from '@material-ui/icons/Search'
import clsx from 'clsx'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Autosuggest, { SuggestionSelectedEventData, SuggestionsFetchRequestedParams } from 'react-autosuggest'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals } from '../../globalStyles'
import { useLocalization, useSnRoute, useTheme } from '../../hooks'
import { CommandProviderManager } from '../../services'
import { CommandPaletteHitsContainer } from './CommandPaletteHitsContainer'
import { CommandPaletteSuggestion } from './CommandPaletteSuggestion'

export interface CommandPaletteItem {
  primaryText: string
  secondaryText?: string
  url: string
  hits: string[]
  content?: GenericContent
  openAction?: () => void
}

const useStyles = makeStyles(() => {
  return createStyles({
    buttonWrapper: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      border: 'none',
      backgroundColor: 'transparent',
      '& .MuiIconButton-root': {
        color: globals.common.headerText,
      },
    },
    buttonWrapperOpened: {
      border: '1px solid #13a5ad',
      backgroundColor: 'rgba(255,255,255,.10)',
      marginRight: '40px',
    },
    iconButton: {
      color: globals.common.headerText,
      '&:hover': {
        backgroundColor: 'initial',
      },
    },
    comboBox: {
      position: 'relative',
      overflow: 'visible',
      transition:
        'width cubic-bezier(0.230, 1.000, 0.320, 1.000) 350ms, opacity cubic-bezier(0.230, 1.000, 0.320, 1.000) 250ms',
      opacity: 0,
      width: 0,
    },
    comboBoxOpened: {
      opacity: 1,
      width: '100%',
    },
  })
})

export const CommandPalette = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [delayedOpened, setDelayedOpened] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [items, setItems] = useState<CommandPaletteItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const localization = useLocalization().commandPalette
  const theme = useTheme()
  const history = useHistory()
  const classes = useStyles()
  const device = useContext(ResponsiveContext)
  const uiSettings = useContext(ResponsivePersonalSettings)
  const injector = useInjector()
  const repository = useRepository()
  const cpm = useMemo(() => injector.getInstance(CommandProviderManager), [injector])
  const snRoute = useSnRoute()

  useEffect(() => {
    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ev.key && ev.key.toLowerCase() === 'p' && ev.ctrlKey) {
        ev.stopImmediatePropagation()
        ev.preventDefault()
        if (ev.shiftKey) {
          setInputValue('>')
          setIsOpened(true)
        } else {
          setInputValue('')
          setIsOpened(true)
        }
      } else {
        if (ev.key === 'Escape') {
          setIsOpened(false)
        }
      }
    }
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('keydown', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!isOpened) {
      setItems([])
      setInputValue('')
    } else {
      const setDelayedOpenedState = debounce((value: boolean) => {
        if (value !== delayedOpened) {
          setDelayedOpened(value)
        }
      }, 370)

      if (containerRef.current) {
        const input = containerRef.current.querySelector('input')
        if (input) {
          input.focus()
        }
      }
      setDelayedOpenedState(isOpened)
    }
  }, [delayedOpened, isOpened])

  const handleSuggestionsFetchRequested = async (options: SuggestionsFetchRequestedParams) => {
    const foundItems = await cpm.getItems({
      term: options.value,
      repository,
      device,
      uiSettings,
      location: history.location,
      snRoute,
    })
    setItems(foundItems)
  }

  const handleSelectSuggestion = (
    ev: React.SyntheticEvent,
    suggestion: SuggestionSelectedEventData<CommandPaletteItem>,
  ) => {
    ev.preventDefault()
    suggestion.suggestion.openAction?.() || history.push(suggestion.suggestion.url)

    if (containerRef.current) {
      const input = containerRef.current.querySelector('input')
      if (input) {
        input.blur()
      }
    }
    setIsOpened(false)
  }

  return (
    <div
      className={clsx(classes.buttonWrapper, {
        [classes.buttonWrapperOpened]: isOpened,
      })}>
      {isOpened ? null : (
        <Tooltip placeholder="bottom-end" title={localization.title}>
          <IconButton onClick={() => setIsOpened(true)} className={classes.iconButton} data-test="search-button">
            <Search />
          </IconButton>
        </Tooltip>
      )}

      <div
        ref={containerRef}
        className={clsx(classes.comboBox, {
          [classes.comboBoxOpened]: isOpened,
        })}
        data-test="command-box">
        <Autosuggest<CommandPaletteItem>
          theme={{
            suggestionsList: {
              listStyle: 'none',
              margin: 0,
              padding: 0,
            },
            input: {
              width: '100%',
              padding: '5px',
              fontFamily: 'monospace',
              color: theme.palette.common.white,
              backgroundColor: 'transparent',
              border: 'none',
              margin: '.3em 0',
            },
            inputFocused: {
              outlineWidth: 0,
            },
          }}
          alwaysRenderSuggestions={isOpened}
          suggestions={items}
          highlightFirstSuggestion={true}
          onSuggestionSelected={handleSelectSuggestion}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={() => setItems([])}
          getSuggestionValue={(suggestion) => suggestion.primaryText}
          renderSuggestion={(suggestion, params) => (
            <CommandPaletteSuggestion suggestion={suggestion} params={params} />
          )}
          renderSuggestionsContainer={(params) => <CommandPaletteHitsContainer {...params} />}
          inputProps={{
            value: inputValue,
            onChange: (_ev, changeEvent) => {
              setInputValue(changeEvent.newValue)
            },
            id: 'CommandBoxInput',
            spellCheck: false,
            onBlur: () => setIsOpened(false),
          }}
        />
        {inputValue && (
          <IconButton
            title={localization.clear}
            style={{ position: 'absolute', right: '20px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => {
              setInputValue('')
              setItems([])
              handleSuggestionsFetchRequested({ value: '', reason: 'input-changed' })
            }}
            onMouseDown={(ev) => ev.preventDefault()}>
            <Clear />
          </IconButton>
        )}
      </div>
    </div>
  )
}
