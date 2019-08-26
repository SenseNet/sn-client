import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { LoginState } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import logo from '../assets/sensenet-icon-32.png'
import { ResponsiveContext } from '../context'
import { useLocalization, usePersonalSettings, useTheme } from '../hooks'
import { RepositoryManager } from '../services/RepositoryManager'
import { getMatchParts } from './command-palette/CommandPaletteSuggestion'
import { UserAvatar } from './UserAvatar'

export const RepositorySelectorComponent: React.FunctionComponent<
  RouteComponentProps & { alwaysOpened?: boolean }
> = props => {
  const settings = usePersonalSettings()
  const repo = useRepository()
  const theme = useTheme()
  const device = useContext(ResponsiveContext)
  const [isActive, setIsActive] = useState(props.alwaysOpened || false)
  const [lastRepositoryName, setLastRepositoryName] = useState('')
  const [lastRepositoryUrl, setLastRepositoryUrl] = useState('')
  const [inputValue, setInputValue] = useState(settings.lastRepository)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<typeof settings.repositories[0]>>([])
  const repoManager = useInjector().getInstance(RepositoryManager)

  const localization = useLocalization().repositorySelector

  useEffect(() => {
    const lastRepo = settings.repositories.find(r => r.url === repo.configuration.repositoryUrl)
    if (lastRepo) {
      setLastRepositoryName(lastRepo.displayName || lastRepo.url)
      setLastRepositoryUrl(lastRepo.url)
    }
  }, [repo, settings])

  if (!isActive) {
    return (
      <Typography
        style={{
          textAlign: device === 'mobile' ? 'center' : 'left',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        variant="h5">
        <Link to="/">
          <img src={logo} style={{ marginRight: '.5em', filter: 'drop-shadow(0px 0px 3px black)' }} />
        </Link>
        <Link
          to={`/${btoa(lastRepositoryUrl)}`}
          title={lastRepositoryName}
          style={{
            flexShrink: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            color: theme.palette.text.primary,
          }}>
          {lastRepositoryName}
        </Link>
        <IconButton onClick={() => setIsActive(true)}>
          <KeyboardArrowDown />
        </IconButton>
      </Typography>
    )
  }

  return (
    <ClickAwayListener onClickAway={() => setIsActive(false)}>
      <div
        style={{
          width: '100%',
          border: '1px solid #13a5ad',
          backgroundColor: 'rgba(255,255,255,.10)',
          display: 'flex',
        }}>
        <img
          src={logo}
          style={{
            filter: 'grayscale() brightness(1.4) drop-shadow(black 0px 0px 3px)',
            transform: 'scale(0.75)',
          }}
        />
        <Autosuggest
          theme={{
            container: {
              width: '100%',
            },
            suggestionsList: {
              listStyle: 'none',
            },
            input: {
              background: 'transparent',
              border: 'none',
              color: theme.palette.text.primary,
              fontFamily: 'monospace',
              width: '100%',
              height: '100%',
            },
            inputFocused: {
              outlineWidth: 0,
            },
          }}
          getSuggestionValue={s => s.url.toString()}
          alwaysRenderSuggestions={isActive}
          inputProps={{
            onChange: ev => setInputValue(ev.currentTarget.value.toString()),
            value: inputValue,
            autoFocus: true,
            placeholder: localization.typeToFilter,
          }}
          renderSuggestionsContainer={options => {
            return (
              <Paper
                square={true}
                style={{
                  position: 'fixed',
                  zIndex: 1,
                  marginTop: '1px',
                  left: device === 'mobile' ? '16px' : undefined,
                  width: device === 'mobile' ? 'calc(100% - 32px)' : undefined,
                  overflow: 'hidden',
                }}>
                <List component="nav" {...options.containerProps} style={{ padding: 0 }}>
                  {options.children}
                </List>
                <Typography
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    margin: '0 1em 1em 0',
                    color: theme.palette.text.secondary,
                  }}>
                  <NavLink to="/login" onClick={() => setIsActive(false)}>
                    {localization.anotherRepo}
                  </NavLink>
                </Typography>
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
            <Tooltip
              placement="right"
              title={
                <>
                  {repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                  LoginState.Authenticated
                    ? localization.loggedInAs.replace(
                        '{0}',
                        repoManager.getRepository(suggestion.url).authentication.currentUser.getValue().DisplayName ||
                          '',
                      )
                    : localization.notLoggedIn}
                </>
              }>
              <ListItem button={true} selected={params.isHighlighted} ContainerComponent="div">
                <ListItemIcon style={{ marginRight: 0 }}>
                  {repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                  LoginState.Authenticated ? (
                    <UserAvatar
                      repositoryUrl={suggestion.url}
                      user={repoManager.getRepository(suggestion.url).authentication.currentUser.getValue()}
                    />
                  ) : (
                    <FiberManualRecord
                      style={{
                        filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,.3))',
                        color:
                          repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                          LoginState.Authenticated
                            ? 'green'
                            : repoManager.getRepository(suggestion.url).authentication.state.getValue() ===
                              LoginState.Unauthenticated
                            ? 'red'
                            : 'yellow',
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={getMatchParts([params.query || ''], suggestion.displayName || suggestion.url)}
                  secondary={suggestion.displayName ? getMatchParts([params.query || ''], suggestion.url) : undefined}
                  secondaryTypographyProps={{
                    style: {
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    },
                  }}
                />
              </ListItem>
            </Tooltip>
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
      </div>
    </ClickAwayListener>
  )
}

const routed = withRouter(RepositorySelectorComponent)

export { routed as RepositorySelector }
