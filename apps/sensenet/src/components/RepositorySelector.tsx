import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { LoginState } from '@sensenet/client-core'
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { RouteComponentProps, withRouter } from 'react-router'
import { InjectorContext } from '../context/InjectorContext'
import { PersonalSettingsContext } from '../context/PersonalSettingsContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { ResponsiveContext } from '../context/ResponsiveContextProvider'
import { ThemeContext } from '../context/ThemeContext'
import { RepositoryManager } from '../services/RepositoryManager'
import { getMatchParts } from './command-palette/CommandPaletteSuggestion'

export const RepositorySelectorComponent: React.FunctionComponent<
  RouteComponentProps & { alwaysOpened?: boolean }
> = props => {
  const settings = useContext(PersonalSettingsContext)
  const repo = useContext(RepositoryContext)
  const theme = useContext(ThemeContext)
  const device = useContext(ResponsiveContext)
  const [isActive, setIsActive] = useState(props.alwaysOpened || false)
  const [lastRepositoryName, setLastRepositoryName] = useState('')
  const [inputValue, setInputValue] = useState(settings.lastRepository)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<typeof settings.repositories[0]>>([])
  const repoManager = useContext(InjectorContext).GetInstance(RepositoryManager)

  useEffect(() => {
    const lastRepo = settings.repositories.find(r => r.url === repo.configuration.repositoryUrl)
    if (lastRepo) {
      setLastRepositoryName(lastRepo.displayName || lastRepo.url)
    }
  }, [repo, settings])

  if (!isActive) {
    return (
      <Typography
        style={{
          textAlign: device === 'mobile' ? 'center' : 'left',
          flexGrow: 1,
        }}
        variant="h5">
        {lastRepositoryName}
        <IconButton onClick={() => setIsActive(true)}>
          <KeyboardArrowDown />
        </IconButton>
      </Typography>
    )
  }

  return (
    <ClickAwayListener onClickAway={() => setIsActive(false)}>
      <Autosuggest
        theme={{
          suggestionsList: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            minWidth: '400px',
          },
          input: {
            background: 'transparent',
            borderColor: theme.palette.primary.main,
            borderStyle: 'solid',
            color: theme.palette.text.primary,
            padding: '.3em',
            fontFamily: 'monospace',
            minWidth: '400px',
          },
        }}
        getSuggestionValue={s => s.url.toString()}
        alwaysRenderSuggestions={isActive}
        inputProps={{
          onChange: ev => setInputValue(ev.currentTarget.value.toString()),
          value: inputValue,
          autoFocus: true,
        }}
        renderSuggestionsContainer={options => {
          return (
            <Paper
              square={true}
              style={{
                position: 'fixed',
                zIndex: 1,
              }}>
              <List component="nav" {...options.containerProps} style={{ padding: 0 }}>
                {options.children}
              </List>
            </Paper>
          )
        }}
        onSuggestionSelected={(ev, s) => {
          ev.preventDefault()
          ev.stopPropagation()
          setIsActive(false)
          setInputValue('')
          props.history.push(`/${btoa(s.suggestion.url)}/`)
        }}
        renderSuggestion={(suggestion, params) => (
          <ListItem button={true} selected={params.isHighlighted}>
            <ListItemText
              primary={getMatchParts(params.query || '', suggestion.displayName || suggestion.url)}
              secondary={suggestion.displayName ? getMatchParts(params.query || '', suggestion.url) : undefined}
              secondaryTypographyProps={{
                style: {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
              }}
            />
            <ListItemSecondaryAction>
              <Tooltip
                placement="right"
                title={
                  <>
                    {repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                    LoginState.Authenticated ? (
                      <>
                        You are currently logged in as{' '}
                        <strong>
                          {repoManager.getRepository(suggestion.url).authentication.currentUser.getValue().DisplayName}
                        </strong>{' '}
                      </>
                    ) : (
                      <> You are not logged in</>
                    )}
                  </>
                }>
                <FiberManualRecord
                  style={{
                    filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,.3))',
                    color:
                      repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                      LoginState.Authenticated
                        ? 'green'
                        : 'red',
                  }}
                />
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        )}
        onSuggestionsFetchRequested={s => {
          setFilteredSuggestions(
            settings.repositories.filter(
              r => r.url.indexOf(s.value) !== -1 || (r.displayName && r.displayName.indexOf(s.value) !== -1),
            ),
          )
        }}
        suggestions={filteredSuggestions}
        onSuggestionsClearRequested={() => {
          /** */
        }}
      />
    </ClickAwayListener>
  )
}

const routed = withRouter(RepositorySelectorComponent)

export { routed as RepositorySelector }
