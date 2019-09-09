import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardArrowRightTwoTone from '@material-ui/icons/KeyboardArrowRightTwoTone'
import { Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import React from 'react'
import Autosuggest, {
  InputProps,
  SuggestionSelectedEventData,
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest'
import { RouteComponentProps, withRouter } from 'react-router'
import { RepositoryContext } from '@sensenet/hooks-react'
import { LocalizationContext, ThemeContext } from '../../context'
import { CommandPaletteItem, useCommandPalette } from '../../hooks'
import { CommandPaletteHitsContainer } from './CommandPaletteHitsContainer'
import { CommandPaletteSuggestion } from './CommandPaletteSuggestion'

export class CommandPaletteComponent extends React.Component<
  RouteComponentProps & ReturnType<typeof useCommandPalette>,
  { delayedOpened: boolean }
> {
  private containerRef?: HTMLDivElement

  public state: { delayedOpened: boolean } = { delayedOpened: false }

  public static contextType: React.Context<Repository> = RepositoryContext

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key.toLowerCase() === 'p' && ev.ctrlKey) {
      ev.stopImmediatePropagation()
      ev.preventDefault()
      if (ev.shiftKey) {
        this.props.setInputValue('>')
        this.props.setIsOpened(true)
      } else {
        this.props.setInputValue('')
        this.props.setIsOpened(true)
      }
    } else {
      if (ev.key === 'Escape') {
        this.props.setIsOpened(false)
      }
    }
  }

  constructor(props: CommandPaletteComponent['props']) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this)
    this.handleSetInputValue = this.handleSetInputValue.bind(this)
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this)
  }

  private handleSuggestionsFetchRequested = debounce((options: SuggestionsFetchRequestedParams, repo: Repository) => {
    this.props.setRepository(repo)
    this.props.setInputValue(options.value)
  }, 200)

  public componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('keydown', this.handleKeyUp)
  }

  private handleSetInputValue(ev: React.ChangeEvent<HTMLInputElement>) {
    this.props.setInputValue(ev.target.value)
  }

  private handleSelectSuggestion(
    ev: React.SyntheticEvent,
    suggestion: SuggestionSelectedEventData<CommandPaletteItem>,
  ) {
    ev.preventDefault()
    if (suggestion.suggestion.openAction) {
      suggestion.suggestion.openAction()
    } else {
      this.props.history.push(suggestion.suggestion.url)
    }
    this.props.setIsOpened(false)
  }

  private setDelayedOpenedState = debounce((value: boolean) => {
    if (value !== this.state.delayedOpened) {
      this.setState({ delayedOpened: value })
    }
  }, 370)

  public componentDidUpdate(prevProps: CommandPaletteComponent['props']) {
    if (this.props.isOpened && !prevProps.isOpened) {
      if (this.containerRef) {
        const input = this.containerRef.querySelector('input')
        if (input) {
          input.focus()
        }
      }
    }
    this.setDelayedOpenedState(this.props.isOpened)
  }

  public render() {
    const inputProps: InputProps<CommandPaletteItem> = {
      value: this.props.inputValue || '',
      onChange: this.handleSetInputValue,
      id: 'CommandBoxInput',
      autoFocus: true,
      spellCheck: false,
      onBlur: () => this.props.setIsOpened(false),
    }

    return (
      <ClickAwayListener onClickAway={() => this.props.setIsOpened(false)}>
        <ThemeContext.Consumer>
          {theme => (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                border: this.props.isOpened ? '1px solid #13a5ad' : '',
                backgroundColor: this.props.isOpened ? 'rgba(255,255,255,.10)' : 'transparent',
              }}>
              {this.props.isOpened ? null : (
                <LocalizationContext.Consumer>
                  {localization => (
                    <Tooltip style={{}} placeholder="bottom-end" title={localization.values.commandPalette.title}>
                      <IconButton onClick={() => this.props.setIsOpened(true)} style={{ padding: undefined }}>
                        <KeyboardArrowRightTwoTone />
                        {'_'}
                      </IconButton>
                    </Tooltip>
                  )}
                </LocalizationContext.Consumer>
              )}

              <div
                ref={r => (r ? (this.containerRef = r) : null)}
                style={{
                  overflow: 'visible',
                  transition:
                    'width cubic-bezier(0.230, 1.000, 0.320, 1.000) 350ms, opacity cubic-bezier(0.230, 1.000, 0.320, 1.000) 250ms',
                  opacity: this.props.isOpened ? 1 : 0,
                  width: this.props.isOpened ? '100%' : 0,
                }}>
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
                      color: theme.palette.text.primary,
                      backgroundColor: 'transparent',
                      border: 'none',
                      margin: '.3em 0',
                    },
                    inputFocused: {
                      outlineWidth: 0,
                    },
                  }}
                  alwaysRenderSuggestions={this.state.delayedOpened}
                  suggestions={this.props.items}
                  highlightFirstSuggestion={true}
                  onSuggestionSelected={this.handleSelectSuggestion}
                  onSuggestionsFetchRequested={e => this.handleSuggestionsFetchRequested(e, this.context)}
                  onSuggestionsClearRequested={() => this.props.setItems([])}
                  getSuggestionValue={s => s.primaryText}
                  renderSuggestion={(s, params) => <CommandPaletteSuggestion suggestion={s} params={params} />}
                  renderSuggestionsContainer={s => (
                    <CommandPaletteHitsContainer
                      {...s}
                      width={(this.containerRef && this.containerRef.scrollWidth) || 100}
                    />
                  )}
                  inputProps={inputProps}
                />
              </div>
            </div>
          )}
        </ThemeContext.Consumer>
      </ClickAwayListener>
    )
  }
}

const routed = withRouter(CommandPaletteComponent)

export { routed as CommandPalette }
