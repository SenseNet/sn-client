import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    listItem: {
      listStyleType: 'none',
      flexFlow: 'column',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      padding: 0,
    },
    avatar: {
      width: 80,
      height: 80,
    },
    change: {
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '11px',
      color: theme.palette.primary.main,
    },
  })
})

const DEFAULT_AVATAR_PATH = '/demoavatars/Admin.png'
const CHANGE_AVATAR = 'Change avatar'
const ADD_AVATAR = 'Add avatar'

interface DefaultAvatarTemplateProps {
  repositoryUrl?: string
  add?: () => void
  url?: string
  remove?: () => void
  actionName?: 'new' | 'edit' | 'browse' | 'version'
  readOnly?: boolean
  renderIcon: (name: string) => JSX.Element
}

/**
 * Represents a default component for Avatar control.
 */
export const DefaultAvatarTemplate: React.FC<DefaultAvatarTemplateProps> = (props) => {
  const { actionName, readOnly, repositoryUrl, url } = props
  const classes = useStyles()
  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <Avatar
          src={url ? `${repositoryUrl}${url}` : `${repositoryUrl}${DEFAULT_AVATAR_PATH}`}
          className={classes.avatar}
        />
      </ListItemAvatar>
      {actionName && actionName !== 'browse' && !readOnly ? (
        <div className={classes.change} onClick={props.add}>
          {url ? CHANGE_AVATAR : ADD_AVATAR}
        </div>
      ) : null}
    </ListItem>
  )
}
