import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, ListItemIcon, ListItemText } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { useRepository, useSession } from '@sensenet/hooks-react'
import { NavLink } from 'react-router-dom'
import { UserAvatar } from '../UserAvatar'
import { useLocalization } from '../../hooks'
import { useDialog } from '../dialogs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      padding: '8px 16px',
      background: theme.palette.background.paper,
      alignItems: 'center',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }),
)

export const DesktopNavMenu: React.FunctionComponent = props => {
  const classes = useStyles()
  const { openDialog } = useDialog()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const session = useSession()
  const repo = useRepository()
  const localization = useLocalization()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const logout = () => {
    openDialog({ name: 'logout', props: { userToLogout: session.currentUser } })
  }

  return (
    <div className={classes.root}>
      <UserAvatar user={session.currentUser} repositoryUrl={repo.configuration.repositoryUrl} />
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        style={{ padding: '0' }}>
        <KeyboardArrowDown />
      </IconButton>
      <Popper
        style={{ marginTop: '20px' }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom',
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <UserAvatar user={session.currentUser} repositoryUrl={repo.configuration.repositoryUrl} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { overflow: 'hidden', textOverflow: 'ellipsis' },
                        title: session.currentUser.DisplayName || session.currentUser.Name,
                      }}
                      primary={`${session.currentUser.DisplayName || session.currentUser.Name} user`}
                    />
                  </MenuItem>
                  <NavLink to="/login">
                    <MenuItem>{localization.topMenu.changeRepo} </MenuItem>
                  </NavLink>
                  <NavLink to="/personalSettings">
                    <MenuItem>{localization.topMenu.personalSettings}</MenuItem>
                  </NavLink>
                  <MenuItem onClick={logout}>{localization.topMenu.logout}</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
