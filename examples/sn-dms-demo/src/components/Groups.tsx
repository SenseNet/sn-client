import AppBar from '@material-ui/core/AppBar'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import { ConstantContent } from '@sensenet/client-core'
import { compile } from 'path-to-regexp'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import * as DMSActions from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { rootStateType } from '../store/rootReducer'
import { getAllowedTypes, loadGroup } from '../store/usersandgroups/actions'
import ActionMenu from './ActionMenu/ActionMenu'
import BreadCrumb from './BreadCrumb'
import { GridPlaceholder } from './Loaders/GridPlaceholder'
import GroupInfo from './UsersAndGroups/Group/GroupInfo'
import GroupList from './UsersAndGroups/Group/GroupList'
import MembersList from './UsersAndGroups/User/MembersList'
import MembersListToolbar from './UsersAndGroups/User/MembersListToolbar'
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

interface GroupsProps extends RouteComponentProps<any> {
  matchesDesktop: boolean
}

interface GroupsState {
  groupName: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    isAdmin: state.dms.usersAndGroups.user.isAdmin,
    group: state.dms.usersAndGroups.group.currentGroup,
    ancestors: state.dms.usersAndGroups.group.ancestors,
    isLoading: state.dms.usersAndGroups.group.isLoading,
  }
}

const mapDispatchToProps = {
  loadGroup,
  getAllowedTypes,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
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
      if (newProps.match.params.otherActions) {
        const guid = newProps.match.params.otherActions.replace('group', '').replace(/\//g, '')
        const groupIdFromUrl = newProps.match.params.otherActions && atob(decodeURIComponent(guid))
        newProps.loadGroup(Number(groupIdFromUrl), {
          select: ['Icon', 'Name', 'Path', 'DisplayName', 'Description', 'Members', 'Actions'],
          expand: ['Members', 'Actions'],
          orderby: ['DisplayName' as any, 'asc'],
        })
      } else {
        const idFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.folderPath))
        const groupsRootPath = `/Root`
        newProps.loadGroup(idFromUrl || groupsRootPath, {
          select: ['Icon', 'Name', 'Path', 'DisplayName', 'Description', 'AllowedChildTypes'],
          orderby: ['DisplayName' as any, 'asc'],
        })
        newProps.getAllowedTypes({})
      }
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
    }
  }
  public render() {
    const { ancestors, group, isAdmin, isLoading, loggedinUser, match } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ? (
            <div>
              {this.props.isAdmin ? (
                <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                  <Toolbar style={matches ? (styles.toolbar as any) : (styles.toolbarMobile as any)}>
                    <div style={{ flex: 1, display: 'flex' }}>
                      {group ? (
                        <BreadCrumb
                          ancestors={ancestors}
                          currentContent={group}
                          typeFilter={[
                            'OrganizationalUnit',
                            'Folder',
                            'Domain',
                            'Domains',
                            'Workspace',
                            'SalesWorkspaceFolder',
                            'ProjectWorkspaceFolder',
                            'DocumentWorkspaceFolder',
                            'SalesWorkspace',
                            'ProjectWorkspace',
                            'DocumentWorkspace',
                            'Group',
                          ]}
                        />
                      ) : null}
                      {match.params.otherActions ? null : <UserSelector />}
                    </div>
                  </Toolbar>
                </AppBar>
              ) : null}
              {match.params.otherActions ? (
                <div>
                  <GroupInfo isAdmin={isAdmin} group={group} />
                  <MembersListToolbar />
                  <MembersList matchesDesktop={matches} />
                </div>
              ) : (
                <MuiThemeProvider theme={contentListTheme}>
                  {isLoading ? (
                    <GridPlaceholder
                      columns={5}
                      rows={3}
                      style={{
                        position: 'sticky',
                        zIndex: isLoading ? 1 : -1,
                        height: 0,
                        opacity: isLoading ? 1 : 0,
                        transition: 'opacity 500ms cubic-bezier(0.230, 1.000, 0.320, 1.000)',
                      }}
                      columnStyle={{ backgroundColor: 'white' }}
                    />
                  ) : (
                    <GroupList matchesDesktop={matches} />
                  )}

                  <ActionMenu id={0} />
                </MuiThemeProvider>
              )}
            </div>
          ) : null
        }}
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
