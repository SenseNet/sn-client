import { LoginState } from '@sensenet/client-core'
import React, { lazy, Suspense } from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { LoadSettingsContextProvider, RepositoryContext } from '../context'
import { usePersonalSettings, useSession } from '../hooks'
import { ErrorBoundary } from './ErrorBoundary'
import { FullScreenLoader } from './FullScreenLoader'
import { WopiPage } from './wopi-page'

const ExploreComponent = lazy(async () => await import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(async () => await import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(async () => await import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(
  async () => await import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'),
)
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

const MainRouter: React.StatelessComponent<RouteComponentProps> = () => {
  const sessionContext = useSession()
  const personalSettings = usePersonalSettings()

  return (
    <ErrorBoundary>
      <Route
        render={() => (
          <div style={{ width: '100%', height: '100%' }}>
            <Suspense fallback={<FullScreenLoader />}>
              <Switch>
                <Route
                  path="/personalSettings"
                  render={() => {
                    return <PersonalSettingsEditor />
                  }}
                />
                <Route
                  path="/login"
                  render={() => {
                    return <LoginComponent />
                  }}
                />
                <Route
                  path="/:repo/login"
                  render={() => {
                    return <LoginComponent />
                  }}
                />
                <Route
                  path="/events/:eventGuid?"
                  render={() => {
                    return <EventListComponent />
                  }}
                />

                {/** Requires login */}
                {sessionContext.state === LoginState.Unauthenticated || !personalSettings.lastRepository ? (
                  <LoginComponent />
                ) : sessionContext.state === LoginState.Authenticated ? (
                  <Switch>
                    <Route
                      path="/:repo/browse/:folderId?/:rightParent?"
                      render={() => {
                        return <ExploreComponent />
                      }}
                    />
                    <Route
                      path="/:repo/search/:query?"
                      render={() => {
                        return (
                          <LoadSettingsContextProvider>
                            <SearchComponent />
                          </LoadSettingsContextProvider>
                        )
                      }}
                    />

                    <Route
                      path="/:repo/saved-queries"
                      render={() => {
                        return (
                          <LoadSettingsContextProvider>
                            <SavedQueriesComponent />
                          </LoadSettingsContextProvider>
                        )
                      }}
                    />
                    <Route
                      path="/:repo/iam"
                      render={() => {
                        return <IamComponent />
                      }}
                    />
                    <Route
                      path="/:repo/setup"
                      render={() => {
                        return <SetupComponent />
                      }}
                    />
                    <Route
                      path="/:repo/info"
                      render={() => {
                        return <VersionInfoComponent />
                      }}
                    />
                    <Route
                      path="/:repo/editBinary/:contentId?"
                      render={() => {
                        return <EditBinary />
                      }}
                    />
                    <Route
                      path="/:repo/editProperties/:contentId?"
                      render={() => {
                        return <EditProperties />
                      }}
                    />
                    <Route
                      path="/:repo/preview/:documentId?"
                      render={() => {
                        return <DocumentViewerComponent />
                      }}
                    />
                    <Route path="/:repo/wopi/:documentId/:action?">
                      <WopiPage />
                    </Route>
                    <Route
                      path="/:repo/"
                      render={() => {
                        return (
                          <RepositoryContext.Consumer>
                            {repo => <DashboardComponent repository={repo} />}
                          </RepositoryContext.Consumer>
                        )
                      }}
                    />
                    <Route
                      path="/"
                      render={() => {
                        return <DashboardComponent />
                      }}
                    />
                  </Switch>
                ) : (
                  <FullScreenLoader />
                )}
              </Switch>
            </Suspense>
          </div>
        )}
      />
    </ErrorBoundary>
  )
}

const connectedComponent = withRouter(MainRouter)

export { connectedComponent as MainRouter }
