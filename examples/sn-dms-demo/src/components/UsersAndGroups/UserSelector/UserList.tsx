import MenuList from '@material-ui/core/MenuList'
import withStyles from '@material-ui/core/styles/withStyles'
import { User } from '@sensenet/default-content-types'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../../../store/rootReducer'
import { addUsersToGroups, getUsers, searchUsers } from '../../../store/usersandgroups/actions'
import { UserButtonRow } from './UserButtonRow'
import UserListItem from './UserListItem'
import UserSearch from './UserSearch'

const styles = () => ({
  workspaceList: {
    padding: 0,
    margin: 0,
    overflowY: 'auto',
  },
  toolbar: {
    padding: 10,
    flexGrow: 1,
    minHeight: 'auto',
  },
  button: {
    fontSize: 15,
    margin: 0,
    padding: 0,
    minWidth: 'auto',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#016d9e',
    },
  },
})

const mapStateToProps = (state: rootStateType) => {
  return {
    users: state.dms.usersAndGroups.user.all,
    selected: state.dms.usersAndGroups.user.selected,
    term: state.dms.usersAndGroups.user.searchTerm,
    groups: state.dms.usersAndGroups.group.selected,
  }
}

const mapDispatchToProps = {
  getUsers,
  searchUsers,
  addUsersToGroups,
}

interface UserListState {
  users: User[]
  top: number
  term: string
  filtered: User[]
}

interface UserListProps {
  closeDropDown: (open: boolean) => void
  matches: boolean
}

class UserList extends React.Component<
  { classes: any } & UserListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  UserListState
> {
  public state = {
    users: this.props.users,
    selected: this.props.selected,
    top: 0,
    term: '',
    filtered: [],
  }
  constructor(props: UserList['props']) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }
  public static getDerivedStateFromProps(newProps: UserList['props'], lastState: UserList['state']) {
    if (newProps.users.length !== lastState.users.length || lastState.users.length === 0) {
      newProps.getUsers()
    }

    return {
      ...lastState,
      users: newProps.users,
      selected: newProps.selected,
      term: newProps.term,
      filtered:
        newProps.term.length > 0
          ? newProps.users.filter((user: User) =>
              user.FullName ? user.FullName.toLowerCase().indexOf(newProps.term) > -1 : false,
            )
          : newProps.users,
    } as UserList['state']
  }
  public handleSearch = (text: string) => {
    this.props.searchUsers(text)
  }
  public handleCloseClick = () => {
    this.props.closeDropDown(true)
  }
  public isSelected = (user: User) => {
    const selected = this.props.selected.find(item => item.Id === user.Id)
    return selected !== undefined
  }
  public render() {
    const { classes, matches } = this.props
    const { filtered } = this.state
    return (
      <div>
        <UserSearch matches={matches} handleKeyup={this.handleSearch} closeDropDown={this.props.closeDropDown} />
        <Scrollbars
          style={{ height: matches ? window.innerHeight - 400 : window.innerHeight - 88, width: 'calc(100% - 1px)' }}
          renderThumbVertical={({ style }: { style: React.CSSProperties }) => (
            <div style={{ ...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }} />
          )}
          thumbMinSize={180}>
          <MenuList className={classes.workspaceList}>
            {filtered.map((user: User) => (
              <UserListItem
                closeDropDown={this.props.closeDropDown}
                key={user.Id}
                user={user}
                selected={this.isSelected(user)}
              />
            ))}
          </MenuList>
        </Scrollbars>
        <UserButtonRow
          cancelClick={this.props.closeDropDown}
          submitClick={this.props.addUsersToGroups as any}
          groups={this.props.groups}
          users={this.props.selected || null}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles as any)(UserList))
