import {
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import { clsx } from 'clsx'
import React from 'react'
import { matchPath, NavLink, useLocation } from 'react-router-dom'
import { globals, useGlobalStyles } from '../../globalStyles'
import { usePersonalSettings, useSelectionService } from '../../hooks'
import { DrawerItem } from '../../hooks/use-drawer-items'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    navLink: {
      textDecoration: 'none',
      opacity: 0.54,
    },
    navLinkActive: {
      opacity: 1,
      '& .MuiListItem-root': { backgroundColor: theme.palette.primary.main },
      '& .MuiTypography-root': { color: theme.palette.common.white },
      '& svg': {
        fill: theme.palette.common.white,
      },
    },
    listButton: {
      height: '65px',
    },
    listItemIconDark: {
      color: theme.palette.common.white,
      lineHeight: '0px',
    },
    listItemIconLight: {
      color: theme.palette.common.black,
      opacity: 0.87,
      '& > div': {
        lineHeight: '0',
      },
    },
    listIconWrapper: {
      '& .secondary-icon': {
        position: 'absolute',
        marginTop: '-6px',
        marginLeft: '-4px',
        fontSize: globals.common.secondaryIconSize,
      },
    },
  })
})

export interface PermanentDrawerItemProps {
  item: DrawerItem
  opened: boolean
}

export const PermanentDrawerItem: React.FunctionComponent<PermanentDrawerItemProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()

  const selectionService = useSelectionService()
  const location = useLocation()
  const personalSettings = usePersonalSettings()

  return (
    <Tooltip title={props.item.primaryText} placement="right">
      <NavLink
        aria-label={props.item.url}
        to={props.item.url}
        className={classes.navLink}
        onClick={() => {
          selectionService.activeContent.setValue(undefined)
        }}
        activeClassName={classes.navLinkActive}>
        <ListItem
          aria-label={props.item.primaryText}
          className={classes.listButton}
          button={true}
          selected={!!matchPath(location.pathname, props.item.url)}
          data-test={`drawer-menu-item-${props.item.primaryText.replace(/\s+/g, '-').toLowerCase()}`}>
          <ListItemIcon
            className={clsx(classes.listItemIconDark, globalClasses.centered, {
              [classes.listItemIconLight]: personalSettings.theme === 'light',
            })}>
            <div className={classes.listIconWrapper}>{props.item.icon}</div>
          </ListItemIcon>
          {props.opened && (
            <Tooltip title={props.item.secondaryText} placement="right">
              <ListItemText
                primary={`${props.item.primaryText}`}
                style={{
                  color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
                }}
              />
            </Tooltip>
          )}
        </ListItem>
      </NavLink>
    </Tooltip>
  )
}
