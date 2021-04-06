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
      width: 'auto',
      backgroundColor: '#F6F6F6',
      border: '1px solid #E2E2E2',
    },
    menuItem: {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
      fontSize: '14px',
    },
  }),
)

export type HamburgerMenuClassKey = Partial<ReturnType<typeof useStyles>>

interface HamburgerMenuProps {
  classes?: HamburgerMenuClassKey
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
            <MenuList autoFocusItem={isPopperOpen}>
              <Link href="https://github.com/SenseNet/sn-client/tree/master/examples/sn-react-tasklist" target="_blank">
                <MenuItem className={classes.menuItem}>View source on github</MenuItem>
              </Link>
              <Link
                href="https://docs.sensenet.com/tutorials/getting-started/getting-started-with-react"
                target="_blank">
                <MenuItem className={classes.menuItem}>Develop your application</MenuItem>
              </Link>
              <Link href="https://docs.sensenet.com/" target="_blank">
                <MenuItem className={classes.menuItem}>sensenet documentation</MenuItem>
              </Link>
              <Link href="https://docs.sensenet.com/example-apps" target="_blank">
                <MenuItem className={classes.menuItem}>More examples</MenuItem>
              </Link>
              <Link
                href="https://is.sensenet.com/Account/Registration?returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dspa%26redirect_uri%3Dhttps%253A%252F%252Fprofile.sensenet.com%252Fauthentication%252Fcallback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520sensenet%26state%3D10ff2f66ac7f4a4da1436832a10cdc83%26code_challenge%3DU4n_OVI0Q6zg3PRutc_bsOr6txMXZRSSzkwbWCiqnuo%26code_challenge_method%3DS256%26response_mode%3Dquery%26snrepo%3Dhttps%253A%252F%252Fsnover.service.sensenet.com"
                target="_blank">
                <MenuItem className={classes.menuItem}>Get your own repo</MenuItem>
              </Link>
              <Link href="https://www.sensenet.com/help-center" target="_blank">
                <MenuItem className={classes.menuItem}>Help center</MenuItem>
              </Link>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      ) : null}
    </div>
  )
}
