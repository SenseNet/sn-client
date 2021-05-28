import {
  ClickAwayListener,
  createStyles,
  IconButton,
  Link,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Theme,
} from '@material-ui/core'
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@material-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { HEADER_HEIGHT } from '.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      padding: 0,
      '&:hover': {
        background: 'none',
      },
    },
    menuIcon: {
      color: theme.palette.common.white,
      marginRight: '20px',
      '&:hover': {
        color: '#a49ec5',
      },
    },
    menuIconActive: {
      marginRight: '20px',
      color: '#a49ec5',
    },
    popperWrapper: {
      position: 'absolute',
      top: HEADER_HEIGHT,
      left: 0,
      backgroundColor: '#F6F6F6',
      border: '1px solid #E2E2E2',
      height: `calc(100vh - ${HEADER_HEIGHT})`,
      boxShadow: '12px 0 12px rgb(0 0 0 / 20%)',
      width: '281px',
    },
    menuList: {
      padding: '20px 10px',
    },
    menuItem: {
      fontSize: '14px',
      '&:hover': {
        color: '#342cac',
        backgroundColor: 'transparent',
      },
    },
    menuGroup: {
      padding: '0 20px',
    },
    menuItemFix: {
      color: '#a5a5a5',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    link: {
      '&:hover': {
        textDecoration: 'none',
      },
    },
  }),
)

export type HamburgerMenuClassKey = Partial<ReturnType<typeof useStyles>>

interface HamburgerMenuProps {
  classes?: HamburgerMenuClassKey
  appName?: string
}

export const HamburgerMenu: React.FunctionComponent<HamburgerMenuProps> = (props) => {
  const classes = useStyles(props)

  const anchorRef = useRef<HTMLButtonElement>(null)
  const [isPopperOpen, setIsPopperOpen] = useState(false)

  const handleToggle = () => {
    setIsPopperOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return
    }

    setIsPopperOpen(false)
  }

  const prevOpen = useRef(isPopperOpen)
  useEffect(() => {
    if (prevOpen.current === true && isPopperOpen === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = isPopperOpen
  }, [isPopperOpen])

  return (
    <div>
      <IconButton className={classes.iconButton} onClick={handleToggle} ref={anchorRef}>
        {isPopperOpen ? <MenuOpenIcon className={classes.menuIconActive} /> : <MenuIcon className={classes.menuIcon} />}
      </IconButton>
      {isPopperOpen ? (
        <Paper className={classes.popperWrapper}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList className={classes.menuList} autoFocusItem={isPopperOpen}>
              <MenuItem className={classes.menuItemFix}>Live demo</MenuItem>

              <div className={classes.menuGroup}>
                <Link
                  className={classes.link}
                  href={
                    props.appName
                      ? `https://github.com/SenseNet/sn-client/tree/master/examples/${props.appName}`
                      : 'https://github.com/SenseNet/sn-client/tree/master/examples'
                  }
                  target="_blank">
                  <MenuItem className={classes.menuItem}>Connected repository</MenuItem>
                </Link>
                <Link className={classes.link} href="https://docs.sensenet.com/example-apps" target="_blank">
                  <MenuItem className={classes.menuItem}>More examples</MenuItem>
                </Link>
                <Link className={classes.link} href="https://profile.sensenet.com/?redirectToLogin" target="_blank">
                  <MenuItem className={classes.menuItem}>Get your free repo</MenuItem>
                </Link>
              </div>
              <MenuItem className={classes.menuItemFix}>Resources</MenuItem>
              <div className={classes.menuGroup}>
                <Link
                  className={classes.link}
                  href="https://docs.sensenet.com/tutorials/getting-started"
                  target="_blank">
                  <MenuItem className={classes.menuItem}>Develop your application</MenuItem>
                </Link>
                <Link className={classes.link} href="https://docs.sensenet.com/" target="_blank">
                  <MenuItem className={classes.menuItem}>Documentation</MenuItem>
                </Link>
                <Link className={classes.link} href="https://github.com/SenseNet" target="_blank">
                  <MenuItem className={classes.menuItem}>View on GitHub</MenuItem>
                </Link>
                <Link className={classes.link} href="https://www.sensenet.com/help-center" target="_blank">
                  <MenuItem className={classes.menuItem}>Help center</MenuItem>
                </Link>
              </div>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      ) : null}
    </div>
  )
}
