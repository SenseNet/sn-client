import { createStyles, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'
import Search from '@material-ui/icons/Search'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { SyntheticEvent, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Autosuggest, { SuggestionSelectedEventData, SuggestionsFetchRequestedParams } from 'react-autosuggest'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals } from '../../globalStyles'
import { useLocalization, useSelectionService, useSnRoute, useTheme } from '../../hooks'
import { CommandProviderManager } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { CommandPaletteHitsContainer } from './CommandPaletteHitsContainer'
import { CommandPaletteSuggestion } from './CommandPaletteSuggestion'

export interface CommandPaletteItem {
  primaryText: string
  secondaryText?: string
  url: string
  hits: string[]
  content?: GenericContent
  openAction?: () => void
  parameters?: string[]
}

const useStyles = makeStyles(() => {
  return createStyles({
    buttonWrapper: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
      '& .MuiIconButton-root': {
        color: globals.common.headerText,
      },
    },
    iconButton: {
      color: globals.common.headerText,
      padding: '7px',
      marginRight: '6px',
    },
    comboBox: {
      position: 'relative',
      width: '50%',
      marginRight: '9px',
    },
    input: {
      color: 'white',
      backgroundColor: '#016ea5ff',
      border: 'none',
      height: '33px',
      width: '100%',
      paddingLeft: '12px',
      borderRadius: '4px',
      '&::placeholder': {
        color: 'white',
        opacity: 1, // optional - ensures it's not semi-transparent
      },
    },
    inputOpened: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    actionContextHeader: {
      padding: '8px 12px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      color: '#3c4654',
      fontSize: '12px',
      lineHeight: '16px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    actionContextTarget: {
      fontWeight: 600,
    },
  })
})

export const CommandPalette = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [delayedOpened, setDelayedOpened] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const [contextMenuContent, setContextMenuContent] = useState<GenericContent>()
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
  const isContextMenuInteractingRef = useRef(false)
  const selectionService = useSelectionService()
  const [activeContent, setActiveContent] = useState(selectionService.activeContent.getValue())

  useEffect(() => {
    const activeContentObserver = selectionService.activeContent.subscribe((content) => {
      setActiveContent(content)
    })

    return () => activeContentObserver.dispose()
  }, [selectionService.activeContent])

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

  const latestParamsRef = useRef({
    repository,
    device,
    uiSettings,
    location: history.location,
    snRoute,
  })

  useEffect(() => {
    latestParamsRef.current = {
      repository,
      device,
      uiSettings,
      location: history.location,
      snRoute,
    }
  }, [repository, device, uiSettings, history.location, snRoute])

  const debouncedFetchRef = useRef(
    debounce(async (term: string) => {
      const {
        repository: currentRepository,
        device: currentDevice,
        uiSettings: currentUiSettings,
        location: currentLocation,
        snRoute: currentSnRoute,
      } = latestParamsRef.current

      const foundItems = await cpm.getItems({
        term,
        repository: currentRepository,
        device: currentDevice,
        uiSettings: currentUiSettings,
        location: currentLocation,
        snRoute: currentSnRoute,
      })
      setItems(foundItems)
    }, 200),
  )

  const handleSuggestionsFetchRequested = (options: SuggestionsFetchRequestedParams) => {
    debouncedFetchRef.current(options.value)
  }

  const handleSelectSuggestion = (ev: SyntheticEvent, suggestion: SuggestionSelectedEventData<CommandPaletteItem>) => {
    ev.preventDefault()
    suggestion.suggestion.openAction ? suggestion.suggestion.openAction() : history.push(suggestion.suggestion.url)

    if (containerRef.current) {
      const input = containerRef.current.querySelector('input')
      if (input) {
        input.blur()
      }
    }
    setIsOpened(false)
  }

  const handleOpenSuggestionContextMenu = (ev: React.MouseEvent<HTMLButtonElement>, content: GenericContent) => {
    ev.preventDefault()
    ev.stopPropagation()
    const buttonRect = ev.currentTarget.getBoundingClientRect()
    isContextMenuInteractingRef.current = true
    setContextMenuAnchor({ top: buttonRect.bottom, left: buttonRect.left })
    setContextMenuContent(content)
    setIsContextMenuOpened(true)
    setIsOpened(true)
  }

  const handleCloseSuggestionContextMenu = () => {
    isContextMenuInteractingRef.current = false
    setIsContextMenuOpened(false)
    setIsOpened(false)
  }

  const actionMode = inputValue.startsWith('>')
  const actionContextHeader = actionMode ? (
    <div className={classes.actionContextHeader} data-test="command-palette-action-context">
      {activeContent ? (
        <>
          {localization.actionContext}
          <span className={classes.actionContextTarget} title={activeContent.Path}>
            {activeContent.DisplayName || activeContent.Name}
          </span>
          {activeContent.Path ? ` (${activeContent.Path})` : ''}
        </>
      ) : (
        localization.noActionContext
      )}
    </div>
  ) : undefined

  return (
    <div className={classes.buttonWrapper}>
      <div ref={containerRef} className={classes.comboBox} data-test="command-box">
        <Autosuggest<CommandPaletteItem>
          theme={{
            suggestionsList: {
              listStyle: 'none',
              margin: 0,
              padding: 0,
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
            <CommandPaletteSuggestion
              suggestion={suggestion}
              params={params}
              onOpenContextMenu={handleOpenSuggestionContextMenu}
            />
          )}
          renderSuggestionsContainer={(params) => (
            <CommandPaletteHitsContainer {...params} header={actionContextHeader} />
          )}
          inputProps={{
            className: `${classes.input} ${inputValue ? classes.inputOpened : ''}`,
            value: inputValue,
            placeholder: 'Search',
            onChange: (_ev, changeEvent) => {
              setInputValue(changeEvent.newValue)
            },
            id: 'CommandBoxInput',
            spellCheck: false,
            onBlur: () => {
              if (!isContextMenuInteractingRef.current) {
                setIsOpened(false)
              }
            },
          }}
        />
        {!inputValue && (
          <IconButton
            title={'search'}
            style={{ position: 'absolute', right: '0px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}>
            <Search />
          </IconButton>
        )}
        {inputValue && (
          <IconButton
            title={localization.clear}
            style={{ position: 'absolute', right: '0px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
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
      {contextMenuContent ? (
        <ContentContextMenu
          isOpened={isContextMenuOpened}
          content={contextMenuContent}
          menuProps={{
            anchorReference: 'anchorPosition',
            anchorPosition: contextMenuAnchor,
            BackdropProps: {
              onClick: handleCloseSuggestionContextMenu,
              onContextMenu: (ev: React.MouseEvent) => ev.preventDefault(),
            },
            disableAutoFocusItem: true,
          }}
          onClose={handleCloseSuggestionContextMenu}
        />
      ) : null}
    </div>
  )
}
