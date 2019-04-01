import { MuiThemeProvider } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { ConstantContent } from '@sensenet/client-core'
import { compile } from 'path-to-regexp'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import * as DMSActions from '../../../Actions'
import { contentListTheme } from '../../../assets/contentlist'
import { rootStateType } from '../../../store/rootReducer'
import { getAllowedTypes, loadUser } from '../../../store/usersandgroups/actions'
import BreadCrumb from '../../BreadCrumb'
import { GridPlaceholder } from '../../Loaders/GridPlaceholder'
import GroupSelector from '../GroupSelector/GroupSelector'
import UserList from './UserList'

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

interface UsersProps extends RouteComponentProps<any> {
  matchesDesktop: boolean
}

interface UsersState {
  userName: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    isAdmin: state.dms.usersAndGroups.user.isAdmin,
    currentItem: state.dms.usersAndGroups.user.currentUser,
    ancestors: state.dms.usersAndGroups.user.ancestors,
    isLoading: state.dms.usersAndGroups.user.isLoading,
  }
}

const mapDispatchToProps = {
  loadUser,
  getAllowedTypes,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class Users extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & UsersProps, UsersState> {
  constructor(props: Users['props']) {
    super(props)
    this.state = {
      userName: '',
    }
  }
  private static updateStoreFromPath(newProps: Users['props']) {
    try {
      if (newProps.match.params.otherActions) {
        const uuid = newProps.match.params.otherActions.replace('group', '').replace(/\//g, '')
        const userIdFromUrl = newProps.match.params.otherActions && atob(decodeURIComponent(uuid))
        newProps.loadUser(Number(userIdFromUrl))
      } else {
        const idFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.folderPath))
        const groupsRootPath = `/Root/IMS`
        newProps.loadUser(idFromUrl || groupsRootPath)
        newProps.getAllowedTypes()
      }
    } catch (error) {
      /** Cannot parse current folder from URL */
      return compile(newProps.match.path)({ folderPath: '' })
      // tslint:disable-next-line:no-empty
    }
  }
  public static getDerivedStateFromProps(newProps: Users['props'], lastState: Users['state']) {
    if (newProps.currentItem === null || (newProps.currentItem && newProps.currentItem.Name !== lastState.userName)) {
      const newPath = Users.updateStoreFromPath(newProps)
      if (newPath && newPath !== newProps.match.url) {
        newProps.history.push(newPath)
      }
    }
    return {
      ...lastState,
      userName: newProps.currentItem ? newProps.currentItem.Name : '',
    } as Users['state']
  }
  public render() {
    const { ancestors, currentItem, isLoading, loggedinUser, match } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ? (
            <div>
              {this.props.isAdmin ? (
                <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                  <Toolbar style={matches ? (styles.toolbar as any) : (styles.toolbarMobile as any)}>
                    <div style={{ flex: 1, display: 'flex' }}>
                      {currentItem ? (
                        <BreadCrumb
                          ancestors={ancestors}
                          currentContent={currentItem}
                          typeFilter={['OrganizationalUnit', 'Folder', 'Domain', 'Domains']}
                        />
                      ) : null}
                      {match.params.otherActions ? null : <GroupSelector />}
                    </div>
                  </Toolbar>
                </AppBar>
              ) : null}
              {match.params.otherActions ? (
                <div>aaa</div>
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
                    <UserList matchesDesktop={matches} />
                  )}
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
  )(Users),
)
