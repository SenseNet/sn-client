import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles from '@material-ui/core/styles/withStyles'
import { User } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '../../../store/rootReducer'
import { selectUser } from '../../../store/usersandgroups/actions'

const styles = {
  listItem: {
    listStyleType: 'none',
    borderTop: 'solid 1px #2080aa',
    padding: '12px 12px 12px 0px',
  },
  listItemRoot: {
    padding: 0,
  },
  primary: {
    fontFamily: 'Raleway ExtraBold',
    fontSize: 15,
    lineHeight: '24px',
    color: '#fff',
    background: 'none',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  secondary: {
    color: '#fff',
    fontFamily: 'Raleway SemiBold',
    fontStyle: 'italic',
    fontSize: 11,
  },
  icon: {
    margin: 0,
    color: '#fff',
  },
  iconButton: {
    margin: 0,
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  followedIconButton: {
    margin: 0,
    padding: 0,
    color: '#ffeb3b',
  },
}

interface UserListItemProps extends RouteComponentProps<any> {
  selected: boolean
  user: User
  userName: string
  closeDropDown: (open: boolean) => void
}

const mapStateToProps = (state: rootStateType) => {
  return {
    userName: state.sensenet.session.user.userName,
    options: state.sensenet.currentitems.options,
    users: state.dms.usersAndGroups.user.selected,
  }
}

const mapDispatchToProps = {
  selectUser,
  loadContent: Actions.loadContent,
  fetchContent: Actions.requestContent,
}

class UserListItem extends React.Component<
  { classes: any } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & UserListItemProps, {}
> {
  public checkboxClick = (user: User) => {
    const index = this.props.users.findIndex(g => g.Id === user.Id)
    index === -1
      ? this.props.selectUser([...this.props.users, user])
      : this.props.selectUser([...this.props.users.slice(0, index), ...this.props.users.slice(index + 1)])
  }
  public shortenPath = (path: string) => path.replace('/Root/IMS/', '')
  public render() {
    const { classes, selected, user } = this.props
    return (
      <MenuItem style={styles.listItem}>
        <ListItemIcon className={classes.icon}>
          <IconButton
            className={selected ? classes.followedIconButton : classes.iconButton}
            onClick={() => this.checkboxClick(user as User)}>
            <Icon
              className={selected ? classes.followedIconButton : classes.iconButton}
              type={iconType.materialui}
              iconName={selected ? 'check_box' : 'check_box_outline_blank'}
              style={selected ? { color: '#ffeb3b', margin: '0 10px' } : { color: '#fff', margin: '0 10px' }}
            />
          </IconButton>
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.primary, root: classes.listItemRoot, secondary: classes.secondary }}
          primary={user ? user.FullName : ''}
          secondary={this.shortenPath(user ? user.Path : '')}
        />
      </MenuItem>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(UserListItem)),
)
