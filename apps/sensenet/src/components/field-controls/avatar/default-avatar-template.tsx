import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { DefaultAvatarTemplateProps } from '@sensenet/controls-react'
import React from 'react'

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
      fontSize: '2.5rem',
    },
    change: {
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '11px',
      color: theme.palette.primary.main,
    },
  })
})

const CHANGE_AVATAR = 'Change avatar'
const ADD_AVATAR = 'Add avatar'

/**
 * Represents a default component for Avatar control.
 */
export const DefaultAvatarTemplate: React.FC<DefaultAvatarTemplateProps> = (props) => {
  const { actionName, readOnly, repositoryUrl, url } = props
  const classes = useStyles()

  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        {repositoryUrl && url ? (
          <Avatar src={`${repositoryUrl}${url}`} className={classes.avatar} />
        ) : (
          <Avatar className={classes.avatar}>
            {props.content?.DisplayName?.[0] || props.content?.Name?.[0] || 'U'}
          </Avatar>
        )}
      </ListItemAvatar>
      {actionName && actionName !== 'browse' && !readOnly ? (
        <div className={classes.change} onClick={props.add}>
          {url ? CHANGE_AVATAR : ADD_AVATAR}
        </div>
      ) : null}
    </ListItem>
  )
}
