import {
  createStyles,
  IconButton,
  Link,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Slide,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { Close, Menu as MenuIcon } from '@material-ui/icons'
import clsx from 'clsx'
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
      width: 'auto',
    },
    popperWrapperMobile: {
      width: '100%',
      textAlign: 'center',
      '& .MuiListItem-root': {
        justifyContent: 'center',
      },
    },
    menuList: {
      padding: '20px 10px',
    },
    menuItem: {
      color: '#7a7a7a',
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
      fontSize: '1rem',
      padding: '6px 16px',
    },
    menuItemFixMobile: {
      textDecoration: 'underline',
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
  const theme = useTheme()
  const isUnderMd = useMediaQuery(theme.breakpoints.down('md'))

  const anchorRef = useRef<HTMLButtonElement>(null)
  const [isPopperOpen, setIsPopperOpen] = useState(!isUnderMd)
  console.log(isUnderMd)

  const handleToggle = () => {
    setIsPopperOpen((prevOpen) => !prevOpen)
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
        {isPopperOpen ? <Close className={classes.menuIconActive} /> : <MenuIcon className={classes.menuIcon} />}
      </IconButton>
      <Slide direction="right" in={isPopperOpen} mountOnEnter unmountOnExit>
        <Paper className={clsx(classes.popperWrapper, { [classes.popperWrapperMobile]: isUnderMd })}>
          <MenuList className={classes.menuList} autoFocusItem={isPopperOpen}>
            <div className={clsx(classes.menuItemFix, { [classes.menuItemFixMobile]: isUnderMd })}>Live demo</div>
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
            <div
              className={clsx(classes.menuItemFix, { [classes.menuItemFixMobile]: isUnderMd })}
              style={{ paddingTop: '20px' }}>
              Resources
            </div>
            <div className={classes.menuGroup}>
              <Link className={classes.link} href="https://docs.sensenet.com/tutorials/getting-started" target="_blank">
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
        </Paper>
      </Slide>
    </div>
  )
}
