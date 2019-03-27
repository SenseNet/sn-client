import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Icon } from '@sensenet/icons-react'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../../Actions'
import { resources } from '../../../assets/resources'
import { rootStateType } from '../../../store/rootReducer'
import RemoveUsersFromGroupDialog from '../../Dialogs/RemoveUsersFromGroupDialog'
import UserSelector from '../UserSelector/UserSelector'

const styles = {
  appbar: {
    background: 'transparent',
    boxShadow: 'none',
    padding: '0 12px',
    borderBottom: 'solid 1px #fff',
  },
  toolbar: {
    padding: 0,
    minHeight: 36,
  },
  toolbarAdmin: {
    padding: 0,
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    color: '#666',
    fontFamily: 'Raleway SemiBold',
    fontSize: 18,
    textTransform: 'uppercase',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  button: {
    fontSize: 15,
    fontFamily: 'Raleway SemiBold',
  },
  buttonRaised: {
    fontSize: 14,
    fontFamily: 'Raleway ExtraBold',
    marginRight: 10,
  },
  icon: {
    marginRight: 5,
  },
  iconDisabled: {
    color: '#999',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    isAdmin: state.dms.usersAndGroups.user.isAdmin,
    group: state.dms.usersAndGroups.group.currentGroup,
    users: state.dms.usersAndGroups.user.selected || null,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class MembersListToolbar extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
  public handleClick = () => {
    if (this.props.group) {
      this.props.openDialog(
        <RemoveUsersFromGroupDialog users={this.props.users} group={this.props.group} />,
        resources.DELETE,
        this.props.closeDialog,
      )
    }
  }
  public render() {
    return (
      <AppBar position="static" style={styles.appbar}>
        <Toolbar style={this.props.isAdmin ? styles.toolbarAdmin : styles.toolbar}>
          <Typography variant="h6" color="inherit" noWrap={true} style={styles.title as any}>
            {resources.MEMBERS}
          </Typography>
          {this.props.isAdmin ? (
            <div>
              <UserSelector />
              <Button
                color="primary"
                style={styles.button}
                onClick={() => this.handleClick()}
                disabled={this.props.users.length === 0 ? true : false}>
                <Icon iconName="delete" style={this.props.users.length === 0 ? styles.iconDisabled : styles.icon} />
                {resources.REMOVE_SELECTED_USERS_FROM_GROUP}
              </Button>
            </div>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MembersListToolbar)
