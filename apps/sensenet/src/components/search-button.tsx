import React from 'react'
import { Link } from 'react-router-dom'
import {
  createStyles,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import clsx from 'clsx'
import { applicationPaths } from '../application-paths'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization } from '../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    navLinkListItem: {
      width: '100%',
      height: globals.common.drawerItemHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      textDecoration: 'none',
    },
  })
})

export interface SearchButtonProps {
  isOpened?: boolean
}

export const SearchButton: React.FunctionComponent<SearchButtonProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const localization = useLocalization().drawer

  return (
    <div className={clsx(globalClasses.centered, globalClasses.relative)}>
      {!props.isOpened ? (
        <div className={globalClasses.drawerIconButtonWrapper}>
          <Tooltip title={localization.newSearch} placement="right">
            <Link style={{ textDecoration: 'none' }} to={applicationPaths.search}>
              <IconButton className={globalClasses.drawerButton}>
                <Add className={globalClasses.drawerButtonIcon} />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      ) : (
        <Link className={classes.navLinkListItem} to={applicationPaths.search}>
          <ListItem button={true} style={{ height: globals.common.drawerItemHeight }}>
            <ListItemIcon className={globalClasses.centeredHorizontal}>
              <Tooltip title={localization.newSearch} placement="right">
                <span>
                  <IconButton className={globalClasses.drawerButtonExpanded}>
                    <Add className={globalClasses.drawerButtonIcon} />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={localization.newSearch}
              style={{
                color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
              }}
            />
          </ListItem>
        </Link>
      )}
    </div>
  )
}
