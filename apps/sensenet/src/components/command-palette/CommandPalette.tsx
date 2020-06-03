import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardArrowRightTwoTone from '@material-ui/icons/KeyboardArrowRightTwoTone'
import clsx from 'clsx'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Autosuggest, { SuggestionSelectedEventData, SuggestionsFetchRequestedParams } from 'react-autosuggest'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext } from '../../context'
import { globals } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import { CommandProviderManager } from '../../services'
import { CommandPaletteHitsContainer } from './CommandPaletteHitsContainer'
import { CommandPaletteSuggestion } from './CommandPaletteSuggestion'

export interface CommandPaletteItem {
  primaryText: string
  secondaryText: string
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
    },
    iconButton: {
      padding: undefined,
      color: globals.common.headerText,
      '&:hover': {
        backgroundColor: 'initial',
      },
    },
    comboBox: {
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
  const injector = useInjector()
  const repository = useRepository()

  useEffect(() => {
    ;(async () => {
      const cpm = injector.getInstance(CommandProviderManager)
      const foundItems = await cpm.getItems({ term: inputValue, repository, device })
      setItems(foundItems)
    })()
  }, [device, injector, inputValue, repository])

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

  const handleSuggestionsFetchRequested = debounce((options: SuggestionsFetchRequestedParams) => {
    if (!isOpened) {
      return
    }
    setInputValue(options.value)
  }, 200)

  const handleSelectSuggestion = (
    ev: React.SyntheticEvent,
    suggestion: SuggestionSelectedEventData<CommandPaletteItem>,
  ) => {
    ev.preventDefault()
    if (suggestion.suggestion.openAction) {
      suggestion.suggestion.openAction()
    } else {
      history.push(suggestion.suggestion.url)
    }
    setIsOpened(false)
  }

  return (
    <>
      <div
        className={clsx(classes.buttonWrapper, {
          [classes.buttonWrapperOpened]: isOpened,
        })}>
        {isOpened ? null : (
          <Tooltip placeholder="bottom-end" title={localization.title}>
            <IconButton onClick={() => setIsOpened(true)} className={classes.iconButton}>
              <KeyboardArrowRightTwoTone />
              {'_'}
            </IconButton>
          </Tooltip>
        )}

        <div
          ref={containerRef}
          className={clsx(classes.comboBox, {
            [classes.comboBoxOpened]: isOpened,
          })}>
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
            alwaysRenderSuggestions={delayedOpened}
            suggestions={items}
            highlightFirstSuggestion={true}
            onSuggestionSelected={handleSelectSuggestion}
            onSuggestionsFetchRequested={(e) => {
              handleSuggestionsFetchRequested(e)
            }}
            onSuggestionsClearRequested={() => setItems([])}
            getSuggestionValue={(s) => s.primaryText}
            renderSuggestion={(s, params) => <CommandPaletteSuggestion suggestion={s} params={params} />}
            renderSuggestionsContainer={(s) => (
              <CommandPaletteHitsContainer {...s} width={containerRef.current?.scrollWidth || 100} />
            )}
            inputProps={{
              value: inputValue,
              onChange: (_ev, changeEvent) => {
                if ((changeEvent.newValue as any).value) {
                  setInputValue(changeEvent.newValue)
                }
              },
              id: 'CommandBoxInput',
              autoFocus: true,
              spellCheck: false,
              onBlur: () => setIsOpened(false),
            }}
          />
        </div>
      </div>
    </>
  )
}
