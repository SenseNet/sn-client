import {
  createStyles,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalization } from '../hooks'
import { useRepoState } from '../services'
import { encodeQueryData } from './search'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    mainDiv: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    },
    searchButton: {
      width: '32px',
      height: '32px',
      minHeight: 0,
      padding: 0,
      margin: '0.5rem 0.5rem',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    searchButtonIcon: {
      color: theme.palette.common.white,
    },
    searchButtonExpanded: {
      width: '28px',
      height: '28px',
      minHeight: 0,
      padding: 0,
      backgroundColor: theme.palette.primary.main,
    },
    iconButtonWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
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
  const repo = useRepoState().getCurrentRepoState()!.repository
  const localization = useLocalization().drawer
  const [repoToken, setRepoToken] = useState(btoa(repo.configuration.repositoryUrl))

  useEffect(() => {
    setRepoToken(btoa(repo.configuration.repositoryUrl))
  }, [repo.configuration.repositoryUrl])

  return (
    <div className={classes.mainDiv}>
      {!props.isOpened ? (
        <div className={classes.iconButtonWrapper}>
          <Tooltip title={localization.newSearch} placement="right">
            <Link style={{ textDecoration: 'none' }} to={`/${repoToken}/search/${encodeQueryData({ term: '' })}`}>
              <IconButton className={classes.searchButton}>
                <Add className={classes.searchButtonIcon} />
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
                  <IconButton className={classes.searchButtonExpanded}>
                    <Add className={classes.searchButtonIcon} />
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
