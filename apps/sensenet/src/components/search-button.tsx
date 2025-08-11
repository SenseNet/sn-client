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
import { clsx } from 'clsx'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '../application-paths'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization } from '../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    navLinkListItem: {
      width: '100%',
    },
  })
})

export interface SearchButtonProps {
  isOpened?: boolean
}

export const SearchButton: FunctionComponent<SearchButtonProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const theme = useTheme()
  const localization = useLocalization().drawer

  return (
    <div className={clsx(globalClasses.relative)}>
      {!props.isOpened ? (
        <div>
          <Tooltip title={localization.newSearch}>
            <Link to={PATHS.search.appPath}>
              <IconButton className={globalClasses.drawerButton} style={{ margin: 4 }}>
                <Add className={globalClasses.drawerButtonIcon} />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      ) : (
        <Link to={PATHS.search.appPath}>
          <ListItem button={true} style={{ height: 40, paddingLeft: 4 }}>
            <ListItemIcon>
              <Tooltip title={localization.newSearch}>
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
                marginLeft: 3,
                color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            />
          </ListItem>
        </Link>
      )}
    </div>
  )
}
