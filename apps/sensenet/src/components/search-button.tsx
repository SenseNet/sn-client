import React, { useEffect, useState } from 'react'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, IconButton, ListItem, ListItemIcon, ListItemText, makeStyles, Tooltip } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useLocalization } from '../hooks'
import { useGlobalStyles } from '../globalStyles'
import { encodeQueryData } from './search'

const useStyles = makeStyles(() => {
  return createStyles({
    navLinkListItem: {
      width: '100%',
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

export const SearchButton: React.FunctionComponent<SearchButtonProps> = props => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const localization = useLocalization().drawer
  const [repoToken, setRepoToken] = useState(btoa(repo.configuration.repositoryUrl))

  useEffect(() => {
    setRepoToken(btoa(repo.configuration.repositoryUrl))
  }, [repo.configuration.repositoryUrl])

  return (
    <div className={clsx(globalClasses.centered, globalClasses.relative)}>
      {!props.isOpened ? (
        <div className={globalClasses.drawerIconButtonWrapper}>
          <Tooltip title={localization.newSearch} placement="right">
            <Link style={{ textDecoration: 'none' }} to={`/${repoToken}/search/${encodeQueryData({ term: '' })}`}>
              <IconButton className={globalClasses.drawerButton}>
                <Add className={globalClasses.drawerButtonIcon} />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      ) : (
        <Link className={classes.navLinkListItem} to={`/${repoToken}/search/${encodeQueryData({ term: '' })}`}>
          <ListItem button={true}>
            <ListItemIcon>
              <Tooltip title={localization.newSearch} placement="right">
                <span>
                  <IconButton className={globalClasses.drawerButtonExpanded}>
                    <Add className={globalClasses.drawerButtonIcon} />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={localization.newSearch} />
          </ListItem>
        </Link>
      )}
    </div>
  )
}
