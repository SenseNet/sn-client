import MenuList from '@material-ui/core/MenuList'
import withStyles from '@material-ui/core/styles/withStyles'
import { Group } from '@sensenet/default-content-types'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../../../store/rootReducer'
import { addUserToGroups, getGroups, searchGroups } from '../../../store/usersandgroups/actions'
import { GroupButtonRow } from './GroupButtonRow'
import GroupListItem from './GroupListItem'
import GroupSearch from './GroupSearch'

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
    groups: state.dms.usersAndGroups.group.all,
    selected: state.dms.usersAndGroups.group.selected,
    term: state.dms.usersAndGroups.group.searchTerm,
    memberships: state.dms.usersAndGroups.user.memberships,
    user: state.dms.usersAndGroups.user.currentUser || null,
  }
}

const mapDispatchToProps = {
  getGroups,
  searchGroups,
  addUserToGroups,
}

interface GroupListState {
  groups: Group[]
  top: number
  term: string
  filtered: Group[]
  members: Group[]
}

interface GroupListProps {
  closeDropDown: (open: boolean) => void
  matches: boolean
}

class GroupList extends React.Component<
  { classes: any } & GroupListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  GroupListState
> {
  public state = {
    groups: this.props.groups,
    filtered: [],
    selected: this.props.selected,
    top: 0,
    term: '',
    members: this.props.memberships.d.results,
  }
  constructor(props: GroupList['props']) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }
  public static getDerivedStateFromProps(newProps: GroupList['props'], lastState: GroupList['state']) {
    if (newProps.groups.length !== lastState.groups.length || lastState.groups.length === 0) {
      newProps.getGroups(newProps.memberships as any)
    } else if (newProps.memberships.d.__count !== lastState.members.length) {
      newProps.getGroups(newProps.memberships as any)
    }

    return {
      ...lastState,
      groups: newProps.groups,
      filtered:
        newProps.term.length > 0
          ? newProps.groups.filter(group => group.Name.indexOf(newProps.term) > -1)
          : newProps.groups,
      selected: newProps.selected,
      term: newProps.term,
      members: newProps.memberships.d.results,
    } as GroupList['state']
  }
  public handleSearch = (text: string) => {
    this.props.searchGroups(text)
  }
  public handleCloseClick = () => {
    this.props.closeDropDown(true)
  }
  public isSelected = (group: Group) => {
    const selected = this.props.selected.find(item => item.Id === group.Id)
    return selected !== undefined
  }
  public render() {
    const { classes, matches } = this.props
    const { filtered } = this.state
    return (
      <div>
        <GroupSearch matches={matches} handleKeyup={this.handleSearch} closeDropDown={this.props.closeDropDown} />
        <Scrollbars
          style={{ height: matches ? window.innerHeight - 400 : window.innerHeight - 88, width: 'calc(100% - 1px)' }}
          renderThumbVertical={({ style }: { style: React.CSSProperties }) => (
            <div style={{ ...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }} />
          )}
          thumbMinSize={180}>
          <MenuList className={classes.workspaceList}>
            {filtered.length > 0
              ? filtered.map((group: Group) => (
                  <GroupListItem
                    closeDropDown={this.props.closeDropDown}
                    key={group.Id}
                    group={group}
                    selected={this.isSelected(group)}
                  />
                ))
              : null}
          </MenuList>
        </Scrollbars>
        <GroupButtonRow
          cancelClick={this.props.closeDropDown}
          submitClick={this.props.addUserToGroups as any}
          groups={this.props.selected}
          user={this.props.user || null}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles as any)(GroupList))
