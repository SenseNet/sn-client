import { LoginState } from '@sensenet/client-core'
import React, { lazy, Suspense, useContext, useState } from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { SessionContext } from '../context'
import { ErrorBoundary } from './ErrorBoundary'
import { FullScreenLoader } from './FullScreenLoader'

const ExploreComponent = lazy(async () => await import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(async () => await import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(async () => await import(/* webpackChunkName: "search" */ './search'))
const IamComponent = lazy(async () => await import(/* webpackChunkName: "iam" */ './iam'))
const SetupComponent = lazy(async () => await import(/* webpackChunkName: "setup" */ './setup'))

const LoginComponent = lazy(async () => await import(/* webpackChunkName: "Login" */ './Login'))
const EditBinary = lazy(async () => await import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(async () => await import(/* webpackChunkName: "editProperties" */ './edit/EditProperties'))
const DocumentViewerComponent = lazy(async () => await import(/* webpackChunkName: "DocViewer" */ './DocViewer'))

const VersionInfoComponent = lazy(async () => await import(/* webpackChunkName: "Version Info" */ './version-info'))
const EventListComponent = lazy(async () => await import(/* webpackChunkName: "EventList" */ './event-list'))

const PersonalSettingsEditor = lazy(
  async () => await import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

const MainRouter: React.StatelessComponent<RouteComponentProps> = props => {
  const sessionContext = useContext(SessionContext)
  const [currentRoute, setCurrentRoute] = useState(props.location.pathname)

  return (
    <ErrorBoundary>
      <Route
        render={() => (
          <TransitionGroup style={{ width: '100%', height: '100%' }}>
            <CSSTransition
              key={currentRoute}
              classNames="fade"
              timeout={300}
              onEnter={arg => console.log('onEnter', arg)}>
              <Suspense fallback={<FullScreenLoader onStartLoading={() => setCurrentRoute('Loader')} />}>
                <Switch>
                  <Route
                    path="/personalSettings"
                    render={() => {
                      setCurrentRoute('PersonalSettingsEditor')
                      return <PersonalSettingsEditor />
                    }}
                  />
                  <Route
                    path="/login"
                    render={() => {
                      setCurrentRoute('LoginComponent')
                      return <LoginComponent />
                    }}
                  />
                  <Route
                    path="/events"
                    render={() => {
                      setCurrentRoute('EventList')
                      return <EventListComponent />
                    }}
                  />

                  {/** Requires login */}
                  {sessionContext.debouncedState === LoginState.Unauthenticated ? (
                    <LoginComponent />
                  ) : sessionContext.debouncedState === LoginState.Authenticated ? (
                    <Switch>
                      <Route
                        path="/:repo/browse/:folderId?/:rightParent?"
                        render={() => {
                          setCurrentRoute('Explore')
                          return <ExploreComponent />
                        }}
                      />
                      <Route
                        path="/:repo/search"
                        render={() => {
                          setCurrentRoute('Search')
                          return <SearchComponent />
                        }}
                      />
                      <Route
                        path="/:repo/iam"
                        render={() => {
                          setCurrentRoute('IAM')
                          return <IamComponent />
                        }}
                      />
                      <Route
                        path="/:repo/setup"
                        render={() => {
                          setCurrentRoute('Setup')
                          return <SetupComponent />
                        }}
                      />
                      <Route
                        path="/:repo/info"
                        render={() => {
                          setCurrentRoute('VersionInfo')
                          return <VersionInfoComponent />
                        }}
                      />
                      <Route
                        path="/:repo/editBinary/:contentId?"
                        render={() => {
                          setCurrentRoute('EditBinary')
                          return <EditBinary />
                        }}
                      />
                      <Route
                        path="/:repo/editProperties/:contentId?"
                        render={() => {
                          setCurrentRoute('EditProperties')
                          return <EditProperties />
                        }}
                      />
                      <Route
                        path="/:repo/preview/:documentId?"
                        render={() => {
                          setCurrentRoute('DocumentViewer')
                          return <DocumentViewerComponent />
                        }}
                      />
                      <Route
                        path="/"
                        render={() => {
                          setCurrentRoute('DashBoard')
                          return <DashboardComponent />
                        }}
                      />
                    </Switch>
                  ) : (
                    <FullScreenLoader />
                  )}
                </Switch>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    </ErrorBoundary>
  )
}

const connectedComponent = withRouter(MainRouter)

export { connectedComponent as MainRouter }
