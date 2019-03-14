import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { ConstantContent } from '@sensenet/client-core'
import { compile } from 'path-to-regexp'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../store/rootReducer'
import { loadGroup } from '../store/usersandgroups/actions'
import BreadCrumb from './BreadCrumb'
import UserSelector from './UsersAndGroups/UserSelector/UserSelector'

const styles = {
  appBar: {
    background: '#fff',
    boxShadow: 'none',
  },
  appBarMobile: {
    background: '#4cc9f2',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0 12px',
  },
  toolbarMobile: {
    padding: '0',
    minHeight: 36,
    borderBottom: 'solid 1px #fff',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    fontSize: 15,
    fontFamily: 'Raleway SemiBold',
  },
  icon: {
    marginRight: 5,
  },
}

interface GroupsProps extends RouteComponentProps<any> {}

interface GroupsState {
  groupName: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    isAdmin: state.dms.usersAndGroups.user.isAdmin,
    group: state.dms.usersAndGroups.group.currentGroup,
    ancestors: state.dms.usersAndGroups.group.ancestors,
  }
}

const mapDispatchToProps = {
  loadGroup,
}

class Groups extends Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & GroupsProps,
  GroupsState
> {
  constructor(props: Groups['props']) {
    super(props)
    this.state = {
      groupName: '',
    }
  }
  private static updateStoreFromPath(newProps: Groups['props']) {
    try {
      const idFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.otherActions))
      const groupsRootPath = `/Root`
      newProps.loadGroup(Number(idFromUrl) || groupsRootPath, {
        select: ['Icon', 'Name', 'Path', 'DisplayName'],
      })
    } catch (error) {
      /** Cannot parse current folder from URL */
      return compile(newProps.match.path)({ folderPath: '' })
    }
  }
  public static getDerivedStateFromProps(newProps: Groups['props'], lastState: Groups['state']) {
    if (newProps.group === null || (newProps.group && newProps.group.Name !== lastState.groupName)) {
      const newPath = Groups.updateStoreFromPath(newProps)
      if (newPath && newPath !== newProps.match.url) {
        newProps.history.push(newPath)
      }
    }
    return {
      ...lastState,
      groupName: newProps.group ? newProps.group.Name : '',
    } as Groups['state']
  }
  public handleDeleteClick = () => {
    // TODO: delete currentGroup
  }
  public render() {
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches =>
          this.props.loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ? (
            this.props.isAdmin ? (
              <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                <Toolbar style={matches ? (styles.toolbar as any) : (styles.toolbarMobile as any)}>
                  <div style={{ flex: 1, display: 'flex' }}>
                    {this.props.group ? (
                      <BreadCrumb
                        ancestors={this.props.ancestors}
                        currentContent={this.props.group}
                        typeFilter={['OrganizationalUnit', 'Folder', 'Domain']}
                      />
                    ) : null}
                    <UserSelector />
                  </div>
                </Toolbar>
              </AppBar>
            ) : null
          ) : null
        }
      </MediaQuery>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Groups),
)
