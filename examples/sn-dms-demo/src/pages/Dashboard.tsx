import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import { LoginState } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import * as DMSActions from '../Actions'
import { ContentTemplates } from '../components/ContentTemplates'
import { ContentTypes } from '../components/ContentTypes'
import DashboardDrawer from '../components/DashboardDrawer'
import DocumentLibrary from '../components/DocumentLibrary'
import { FullScreenLoader } from '../components/FullScreenLoader'
import Groups from '../components/Groups'
import Header from '../components/Header'
import MobileHeader from '../components/Mobile/Header'
import Picker from '../components/Pickers/PickerBase'
import { SavedQueries } from '../components/SavedQueries'
import { Settings } from '../components/Settings'
import { Shared } from '../components/Shared'
import { Trash } from '../components/Trash'
import UserProfile from '../components/UserProfile'
import { rootStateType } from '../store/rootReducer'

const styles = {
  dashBoardInner: {
    padding: 60,
  },
  dashBoardInnerMobile: {
    marginTop: 36,
    width: '100%',
  },
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden' as any,
    position: 'relative' as any,
    display: 'flex' as any,
    minHeight:
      document.documentElement && window.innerHeight >= document.documentElement.offsetHeight
        ? window.innerHeight
        : 'auto',
  },
  rootMobile: {
    flexGrow: 1,
    zIndex: 1,
    position: 'relative' as any,
    display: 'flex' as any,
  },
  main: {
    flexGrow: 1,
    padding: '0 10px 10px',
    minWidth: 0,
  },
  dialogClose: {
    position: 'absolute',
    right: 0,
  },
  dialogCloseMobile: {
    position: 'absolute',
    right: 0,
    top: '15px',
    fontFamily: 'Raleway Medium',
    color: '#016D9E',
    fontSize: '14px',
  },
  progress: {
    width: '100%',
    textAlign: 'center',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    loginState: state.sensenet.session.loginState,
    isDialogOpen: state.dms.dialog.isOpened,
    dialogContent: state.dms.dialog.content,
  }
}

const mapDispatchToProps = {
  loadUserActions: DMSActions.loadUserActions,
  closeDialog: DMSActions.closeDialog,
}

interface DashboardProps extends RouteComponentProps<any> {
  currentId: number
}

export interface DashboardState {
  currentSelection: number[]
  currentScope: string
  currentViewName: string
  currentUserName: string
}

class DashboardComponent extends React.Component<
  DashboardProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  DashboardState
> {
  public state = {
    currentFolderId: undefined,
    currentSelection: [],
    currentViewName: 'list',
    currentUserName: 'Visitor',
    currentScope: 'documents',
  }

  constructor(props: DashboardComponent['props']) {
    super(props)
  }

  public static getDerivedStateFromProps(
    newProps: DashboardComponent['props'],
    lastState: DashboardComponent['state'],
  ) {
    const currentSelection =
      (newProps.match.params.selection && decodeURIComponent(newProps.match.params.selection)) || []
    const currentViewName = newProps.match.params.action

    if (newProps.loggedinUser.userName !== lastState.currentUserName) {
      newProps.loadUserActions(newProps.loggedinUser.content.Path, 'DMSUserActions')
    }

    return {
      ...lastState,
      currentSelection,
      currentViewName,
      currentScope: newProps.match.params.scope || 'documents',
      currentUserName: newProps.loggedinUser.userName,
    }
  }
  public render() {
    const { closeDialog, isDialogOpen, dialogContent } = this.props

    if (this.props.loginState !== LoginState.Unauthenticated && this.props.loggedinUser.userName === 'Visitor') {
      return null
    }

    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return (
            <div>
              <div style={matches ? { ...styles.root } : { ...styles.rootMobile }}>
                {matches ? <Header /> : <MobileHeader />}
                {matches ? null : <DashboardDrawer />}
                {matches ? (
                  <div style={{ width: '100%', display: 'flex' }}>
                    <DashboardDrawer />
                    <div style={styles.main}>
                      <div style={{ height: 64, width: '100%' }} />
                      <Switch>
                        <Route
                          path="/documents"
                          // tslint:disable-next-line: no-unnecessary-type-annotation
                          component={(props: RouteComponentProps<any>) => (
                            <Switch>
                              <Route path={props.match.url + '/shared'}>
                                <Shared />
                              </Route>

                              <Route path={props.match.url + '/savedqueries'}>
                                <SavedQueries />
                              </Route>
                              <Route path={props.match.url + '/trash'}>
                                <Trash />
                              </Route>
                              <Route
                                path={'/' + PathHelper.joinPaths(props.match.url, '/:folderPath?/:otherActions*')}
                                exact={true}
                                component={() => (
                                  <div>
                                    <DocumentLibrary matchesDesktop={matches} />
                                  </div>
                                )}
                              />
                            </Switch>
                          )}
                        />
                        <Route
                          path="/users"
                          component={() => (
                            <Switch>
                              <Route
                                path={'/' + PathHelper.joinPaths('/users', '/:folderPath?/:otherActions*')}
                                exact={true}
                                component={() => (
                                  <div>
                                    <UserProfile matchesDesktop={matches} />
                                  </div>
                                )}
                              />
                            </Switch>
                          )}
                        />
                        <Route
                          path="/groups"
                          // tslint:disable-next-line: no-unnecessary-type-annotation
                          component={(props: RouteComponentProps<any>) => (
                            <Switch>
                              <Route
                                path={'/' + PathHelper.joinPaths(props.match.url)}
                                exact={true}
                                component={() => (
                                  <div>
                                    <Groups matchesDesktop={matches} />
                                  </div>
                                )}
                              />
                            </Switch>
                          )}
                        />
                        <Route path="/contenttypes">
                          <ContentTypes />
                        </Route>
                        <Route path="/contenttemplates">
                          <ContentTemplates />
                        </Route>
                        <Route path="/settings">
                          <Settings />
                        </Route>

                        <Redirect to="/documents" />
                      </Switch>
                    </div>
                  </div>
                ) : (
                  <div style={styles.dashBoardInnerMobile}>
                    <Switch>
                      <Route
                        path="/documents"
                        // tslint:disable-next-line: no-unnecessary-type-annotation
                        component={(props: RouteComponentProps<any>) => (
                          <Switch>
                            <Route path={props.match.url + '/shared'}>
                              <Shared />
                            </Route>

                            <Route path={props.match.url + '/savedqueries'}>
                              <SavedQueries />
                            </Route>
                            <Route path={props.match.url + '/trash'}>
                              <Trash />
                            </Route>
                            <Route
                              path={'/' + PathHelper.joinPaths(props.match.url)}
                              exact={true}
                              component={() => (
                                <div>
                                  <DocumentLibrary matchesDesktop={matches} />
                                </div>
                              )}
                            />
                          </Switch>
                        )}
                      />
                      <Route
                        path="/users"
                        // tslint:disable-next-line: no-unnecessary-type-annotation
                        component={(props: RouteComponentProps<any>) => (
                          <Switch>
                            <Route
                              path={'/' + PathHelper.joinPaths(props.match.url)}
                              exact={true}
                              component={() => (
                                <div>
                                  <UserProfile matchesDesktop={matches} />
                                </div>
                              )}
                            />
                          </Switch>
                        )}
                      />
                      <Route
                        path="/groups"
                        // tslint:disable-next-line: no-unnecessary-type-annotation
                        component={(props: RouteComponentProps<any>) => (
                          <Switch>
                            <Route
                              path={'/' + PathHelper.joinPaths(props.match.url)}
                              exact={true}
                              component={() => (
                                <div>
                                  <Groups matchesDesktop={matches} />
                                </div>
                              )}
                            />
                          </Switch>
                        )}
                      />
                      <Route path="/contenttypes">
                        <ContentTypes />
                      </Route>
                      <Route path="/contenttemplates">
                        <ContentTemplates />
                      </Route>
                      <Route path="/settings">
                        <Settings />
                      </Route>

                      {/* <Redirect to="/documents" /> */}
                    </Switch>
                  </div>
                )}
              </div>
              <Route
                exact={true}
                path="/:prefix*/preview/:documentId"
                component={() => {
                  const LoadableDmsViewer = Loadable({
                    loader: async () =>
                      (await import(/* webpackChunkName: "viewer" */ '../components/DmsViewer')).DmsViewer,
                    loading: () => <FullScreenLoader />,
                  })
                  return <LoadableDmsViewer />
                }}
              />
              {matches ? (
                <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md">
                  <DialogContent children={dialogContent} />
                  <IconButton onClick={closeDialog} style={styles.dialogClose as any}>
                    <Icon type={iconType.materialui} iconName="close" />
                  </IconButton>
                </Dialog>
              ) : (
                <Drawer open={isDialogOpen} anchor="bottom" onClose={closeDialog}>
                  <DialogContent children={dialogContent} />
                  <Button onClick={closeDialog} style={styles.dialogCloseMobile as any}>
                    Cancel
                  </Button>
                </Drawer>
              )}
              <Picker />
            </div>
          )
        }}
      </MediaQuery>
    )
  }
}
const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardComponent)

export default connectedComponent
