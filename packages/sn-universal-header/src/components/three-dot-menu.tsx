import { ClickAwayListener, createStyles, IconButton, makeStyles, MenuList, Paper, Theme } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { HEADER_HEIGHT } from '.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      right: '1px',
      height: 'fit-content',
      width: 'fit-content',
    },
    popper: {
      backgroundColor: '#F6F6F6',
      border: '1px solid #E2E2E2',
    },
  }),
)

export type ThreeDotMenuClassKey = Partial<ReturnType<typeof useStyles>>

interface ThreeDotMenuProps {
  classes?: ThreeDotMenuClassKey
  menuItems: React.ReactNode
}

export const ThreeDotMenu: React.FunctionComponent<ThreeDotMenuProps> = (props) => {
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
      <IconButton style={{ padding: 0 }} onClick={handleToggle} ref={anchorRef}>
        <MoreVert className={clsx(classes.menuIcon, { [classes.menuIconActive]: isPopperOpen })} />
      </IconButton>
      {isPopperOpen ? (
        <Paper className={classes.popperWrapper}>
          <div className={classes.popper}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={isPopperOpen}>{props.menuItems}</MenuList>
            </ClickAwayListener>
          </div>
        </Paper>
      ) : null}
    </div>
  )
}
