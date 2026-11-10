import {
  AppBar,
  Button,
  ButtonBase,
  CircularProgress,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  List,
  ListItem,
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Bookmark from '@material-ui/icons/Bookmark'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import Storage from '@material-ui/icons/Storage'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { globals } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useRepositoryConnections } from '../../hooks/use-repository-connections'
import {
  getRepositoryConnectionName,
  parseRepositoryConnectionUrl,
  removeRepositoryConnection,
  renameRepositoryConnection,
  RepositoryConnection,
  restoreRepositoryConnection,
  setRepositoryConnectionPinned,
} from '../../services/repository-connections'
import { SensenetLogo } from '../sensenet-logo'

const recentRepositoryLimit = 6

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      backgroundColor:
        theme.palette.type === 'dark' ? globals.common.headerBackground : globals.common.headerLightBackground,
      boxShadow: 'none',
      justifyContent: 'center',
      paddingLeft: theme.spacing(2),
    },
    logo: { height: 32, display: 'block' },
    container: { maxWidth: 880, paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) },
    title: { marginBottom: theme.spacing(3) },
    label: { marginBottom: theme.spacing(1) },
    formRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: { flexDirection: 'column' },
    },
    input: { paddingTop: 11, paddingBottom: 11 },
    continueButton: {
      flexShrink: 0,
      minHeight: 42,
      [theme.breakpoints.down('xs')]: { width: '100%' },
    },
    group: { marginTop: theme.spacing(3) },
    groupTitle: {
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(0.5),
    },
    count: { fontWeight: 400 },
    row: { padding: 0, borderBottom: `1px solid ${theme.palette.divider}`, gap: theme.spacing(0.25) },
    open: {
      flex: 1,
      minWidth: 0,
      padding: theme.spacing(1, 0.5),
      justifyContent: 'flex-start',
      textAlign: 'left',
      gap: theme.spacing(1.5),
      '&:hover': { backgroundColor: theme.palette.action.hover },
    },
    focused: { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 },
    repositoryIcon: {
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(1),
      flexShrink: 0,
      [theme.breakpoints.down('xs')]: { display: 'none' },
    },
    repositoryText: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' },
    repositoryName: { display: 'block', fontWeight: 500 },
    repositoryUrl: { display: 'block', overflowWrap: 'anywhere' },
    date: {
      whiteSpace: 'nowrap',
      marginLeft: theme.spacing(1),
      [theme.breakpoints.down('xs')]: { display: 'none' },
    },
    arrow: { flexShrink: 0, marginLeft: theme.spacing(0.5), color: theme.palette.primary.main },
    iconButton: {
      flexShrink: 0,
      padding: theme.spacing(1),
      '@media (pointer: coarse)': { minWidth: 44, minHeight: 44 },
    },
    showAll: { marginTop: theme.spacing(1) },
    renameInput: { minWidth: 0 },
  }),
)

type LoginPageProps = {
  handleSubmit: (url: string) => void
  isLoginInProgress: boolean
  initialRepositoryUrl?: string
  connectionFailed?: boolean
}

const repositoryDate = (value?: string) => {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString(document.documentElement.lang || undefined, {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  })
}

export default function LoginPage({
  handleSubmit,
  isLoginInProgress,
  initialRepositoryUrl = '',
  connectionFailed = false,
}: LoginPageProps) {
  const classes = useStyles()
  const localization = useLocalization().login
  const { connections } = useRepositoryConnections()
  const [repositoryUrl, setRepositoryUrl] = useState(initialRepositoryUrl)
  const [invalidUrl, setInvalidUrl] = useState(false)
  const [edited, setEdited] = useState(false)
  const [showAllRecent, setShowAllRecent] = useState(false)
  const [activeSubmission, setActiveSubmission] = useState<string>()
  const [menu, setMenu] = useState<{ anchor: HTMLElement; connection: RepositoryConnection }>()
  const [renaming, setRenaming] = useState<RepositoryConnection>()
  const [displayName, setDisplayName] = useState('')
  const [removed, setRemoved] = useState<RepositoryConnection>()
  const main = useRef<HTMLElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const focusRequest = useRef<{ action: string; repoUrl?: string }>()
  const menuFocusRequest = useRef<{ action: string; repoUrl?: string }>()
  const dialogReturnUrl = useRef<string>()
  const pinned = connections.filter((connection) => connection.pinned)
  const recent = connections.filter((connection) => !connection.pinned)
  const visibleRecent = showAllRecent ? recent : recent.slice(0, recentRepositoryLimit)
  const error = invalidUrl
    ? localization.invalidRepositoryUrl
    : connectionFailed && !edited
    ? localization.repositoryConnectionFailed
    : undefined

  useEffect(() => {
    setRepositoryUrl(initialRepositoryUrl)
    setEdited(false)
    setInvalidUrl(false)
  }, [initialRepositoryUrl, connectionFailed])

  const focusControl = useCallback((action: string, repoUrl?: string) => {
    const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-repository-action]'))
    const target = controls.find(
      (control) =>
        control.dataset.repositoryAction === action && (!repoUrl || control.dataset.repositoryUrl === repoUrl),
    )
    const fallback = main.current?.querySelector<HTMLButtonElement>('[data-repository-action="show-all"]')
    ;(target || fallback || input.current)?.focus()
  }, [])

  useLayoutEffect(() => {
    const request = focusRequest.current
    if (request) {
      focusRequest.current = undefined
      focusControl(request.action, request.repoUrl)
    }
  }, [connections, showAllRecent, removed, menu, focusControl])

  const connect = (url: string, submission: string) => {
    if (isLoginInProgress) return
    setActiveSubmission(submission)
    setInvalidUrl(false)
    setEdited(true)
    handleSubmit(url)
  }

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoginInProgress) return
    const parsed = parseRepositoryConnectionUrl(repositoryUrl)
    if (!parsed) {
      setInvalidUrl(true)
      input.current?.focus()
      return
    }
    connect(parsed, 'input')
  }

  const closeMenu = () => {
    menuFocusRequest.current = { action: 'more', repoUrl: menu?.connection.repoUrl }
    setMenu(undefined)
  }

  const closeRename = () => {
    dialogReturnUrl.current = renaming?.repoUrl
    setRenaming(undefined)
  }

  const renderConnections = (items: RepositoryConnection[]) => (
    <List disablePadding={true}>
      {items.map((connection) => {
        const name = getRepositoryConnectionName(connection)
        const date = repositoryDate(connection.lastUsed)
        return (
          <ListItem key={connection.repoUrl} className={classes.row}>
            <ButtonBase
              className={classes.open}
              focusVisibleClassName={classes.focused}
              disabled={isLoginInProgress}
              aria-label={`${localization.connectToRepository(name)} (${connection.repoUrl})`}
              data-repository-action="open"
              data-repository-url={connection.repoUrl}
              onClick={() => connect(connection.repoUrl, connection.repoUrl)}>
              <Storage className={classes.repositoryIcon} fontSize="small" />
              <span className={classes.repositoryText}>
                <Typography component="span" variant="body2" className={classes.repositoryName}>
                  {name}
                </Typography>
                <Typography component="span" variant="caption" color="textSecondary" className={classes.repositoryUrl}>
                  {connection.repoUrl}
                </Typography>
              </span>
              {date && (
                <Tooltip title={localization.lastUsedRepository(date)}>
                  <Typography component="span" variant="caption" color="textSecondary" className={classes.date}>
                    {date}
                  </Typography>
                </Tooltip>
              )}
              {isLoginInProgress && activeSubmission === connection.repoUrl ? (
                <CircularProgress size={18} className={classes.arrow} />
              ) : (
                <ArrowForward fontSize="small" className={classes.arrow} />
              )}
            </ButtonBase>
            <Tooltip title={connection.pinned ? localization.unpinRepository : localization.pinRepository}>
              <span>
                <IconButton
                  className={classes.iconButton}
                  disabled={isLoginInProgress}
                  color={connection.pinned ? 'primary' : 'default'}
                  aria-label={`${
                    connection.pinned ? localization.unpinRepository : localization.pinRepository
                  }: ${name}`}
                  aria-pressed={connection.pinned}
                  data-repository-action="pin"
                  data-repository-url={connection.repoUrl}
                  onClick={() => {
                    focusRequest.current = { action: 'pin', repoUrl: connection.repoUrl }
                    setRepositoryConnectionPinned(connection.repoUrl, !connection.pinned)
                  }}>
                  {connection.pinned ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
            <IconButton
              className={classes.iconButton}
              disabled={isLoginInProgress}
              aria-label={`${localization.repositoryOptions}: ${name}`}
              aria-haspopup="menu"
              aria-controls={menu?.connection.repoUrl === connection.repoUrl ? 'repository-actions' : undefined}
              data-repository-action="more"
              data-repository-url={connection.repoUrl}
              onClick={(event) => setMenu({ anchor: event.currentTarget, connection })}>
              <MoreHoriz fontSize="small" />
            </IconButton>
          </ListItem>
        )
      })}
    </List>
  )

  return (
    <>
      <AppBar className={classes.appBar}>
        <Link to="/" aria-label="sensenet">
          <SensenetLogo className={classes.logo} />
        </Link>
      </AppBar>
      <Container maxWidth="md" className={classes.container}>
        <main ref={main}>
          <Typography variant="h4" component="h1" className={classes.title}>
            {localization.repositoriesTitle}
          </Typography>
          <form onSubmit={handleOnSubmit} noValidate={true}>
            <InputLabel shrink={true} htmlFor="repository" className={classes.label}>
              {localization.repositoryLabel}
            </InputLabel>
            <div className={classes.formRow}>
              <TextField
                id="repository"
                name="repository"
                required={true}
                disabled={isLoginInProgress}
                variant="outlined"
                placeholder="https://…"
                fullWidth={true}
                value={repositoryUrl}
                type="text"
                inputRef={input}
                inputProps={{ className: classes.input, inputMode: 'url', autoCapitalize: 'off', spellCheck: false }}
                error={!!error}
                helperText={error ? <span role="alert">{error}</span> : undefined}
                onChange={(event) => {
                  setRepositoryUrl(event.target.value)
                  setInvalidUrl(false)
                  setEdited(true)
                }}
              />
              <Button
                className={classes.continueButton}
                disabled={isLoginInProgress}
                variant="contained"
                color="primary"
                type="submit"
                endIcon={
                  isLoginInProgress && (!activeSubmission || activeSubmission === 'input') ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ArrowForward fontSize="small" />
                  )
                }>
                {localization.continueToRepository}
              </Button>
            </div>
          </form>
          {pinned.length > 0 && (
            <section className={classes.group} aria-labelledby="pinned-repositories">
              <Typography component="h2" variant="subtitle2" id="pinned-repositories" className={classes.groupTitle}>
                {localization.pinnedRepositories}
                <span className={classes.count}>{pinned.length}</span>
              </Typography>
              {renderConnections(pinned)}
            </section>
          )}
          {recent.length > 0 && (
            <section className={classes.group} aria-labelledby="recent-repositories">
              <Typography component="h2" variant="subtitle2" id="recent-repositories" className={classes.groupTitle}>
                {localization.recentRepositories}
                <span className={classes.count}>
                  {localization.recentRepositoryCount(visibleRecent.length, recent.length)}
                </span>
              </Typography>
              {renderConnections(visibleRecent)}
              {recent.length > recentRepositoryLimit && (
                <Button
                  className={classes.showAll}
                  color="primary"
                  size="small"
                  disabled={isLoginInProgress}
                  aria-expanded={showAllRecent}
                  data-repository-action="show-all"
                  onClick={() => {
                    focusRequest.current = { action: 'show-all' }
                    setShowAllRecent((previous) => !previous)
                  }}>
                  {showAllRecent ? localization.showFewerRepositories : localization.showAllRepositories(recent.length)}
                </Button>
              )}
            </section>
          )}
        </main>
      </Container>
      <Menu
        id="repository-actions"
        anchorEl={menu?.anchor}
        open={!!menu}
        onClose={closeMenu}
        disableRestoreFocus={true}
        TransitionProps={{
          onExited: () => {
            const request = menuFocusRequest.current
            menuFocusRequest.current = undefined
            if (request) focusControl(request.action, request.repoUrl)
          },
        }}>
        <MenuItem
          disabled={isLoginInProgress}
          onClick={() => {
            setRenaming(menu?.connection)
            setDisplayName(menu?.connection.name || '')
            setMenu(undefined)
          }}>
          {localization.renameRepository}
        </MenuItem>
        <MenuItem
          disabled={isLoginInProgress}
          onClick={() => {
            if (!menu) return
            menuFocusRequest.current = { action: 'undo' }
            setRemoved(removeRepositoryConnection(menu.connection.repoUrl))
            setMenu(undefined)
          }}>
          {localization.removeRepositoryFromList}
        </MenuItem>
      </Menu>
      <Dialog
        open={!!renaming}
        onClose={closeRename}
        aria-labelledby="rename-repository-title"
        fullWidth={true}
        maxWidth="xs"
        disableRestoreFocus={true}
        TransitionProps={{
          onExited: () => {
            if (dialogReturnUrl.current) focusControl('more', dialogReturnUrl.current)
            dialogReturnUrl.current = undefined
          },
        }}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (renaming && !isLoginInProgress) renameRepositoryConnection(renaming.repoUrl, displayName)
            closeRename()
          }}>
          <DialogTitle id="rename-repository-title">{localization.renameRepository}</DialogTitle>
          <DialogContent>
            <TextField
              className={classes.renameInput}
              autoFocus={true}
              fullWidth={true}
              label={localization.repositoryDisplayName}
              name="repositoryDisplayName"
              value={displayName}
              placeholder={renaming ? getRepositoryConnectionName({ ...renaming, name: undefined }) : undefined}
              inputProps={{ maxLength: 80 }}
              disabled={isLoginInProgress}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeRename} disabled={isLoginInProgress}>
              {localization.cancelRepositoryRename}
            </Button>
            <Button type="submit" color="primary" disabled={isLoginInProgress}>
              {localization.saveRepositoryName}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!removed}
        key={removed?.repoUrl}
        autoHideDuration={6000}
        message={removed ? localization.repositoryRemovedFromList(getRepositoryConnectionName(removed)) : ''}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setRemoved(undefined)
        }}
        action={
          <Button
            color="inherit"
            size="small"
            disabled={isLoginInProgress}
            data-repository-action="undo"
            onClick={() => {
              if (!removed) return
              focusRequest.current = { action: 'open', repoUrl: removed.repoUrl }
              restoreRepositoryConnection(removed)
              setRemoved(undefined)
            }}>
            {localization.undoRepositoryRemoval}
          </Button>
        }
      />
    </>
  )
}
