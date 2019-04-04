import { LoginState } from '@sensenet/client-core'
import React, { lazy, Suspense, useContext } from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { SessionContext } from '../context'
import { AuthorizedRoute } from './AuthorizedRoute'
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

const PersonalSettingsEditor = lazy(
  async () => await import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

const MainRouter: React.StatelessComponent<RouteComponentProps> = () => {
  const sessionContext = useContext(SessionContext)

  return (
    <ErrorBoundary>
      <Suspense fallback={<FullScreenLoader />}>
        <Switch>
          <AuthorizedRoute path="/personalSettings" render={() => <PersonalSettingsEditor />} authorize={() => true} />

          <AuthorizedRoute path="/login" render={() => <LoginComponent />} authorize={() => true} />

          {/** Requires login */}
          {sessionContext.debouncedState === LoginState.Unauthenticated ? (
            <LoginComponent />
          ) : sessionContext.debouncedState === LoginState.Authenticated ? (
            <Switch>
              <AuthorizedRoute
                path="/:repo/browse/:folderId?/:rightParent?"
                render={() => <ExploreComponent />}
                authorize={() => true}
              />
              <AuthorizedRoute path="/:repo/search" render={() => <SearchComponent />} authorize={() => true} />
              <AuthorizedRoute path="/:repo/iam" render={() => <IamComponent />} authorize={() => true} />
              <AuthorizedRoute path="/:repo/setup" render={() => <SetupComponent />} authorize={() => true} />
              <AuthorizedRoute path="/:repo/info" render={() => <VersionInfoComponent />} authorize={() => true} />
              <AuthorizedRoute
                path="/:repo/editBinary/:contentId?"
                render={() => <EditBinary />}
                authorize={() => true}
              />
              <AuthorizedRoute
                path="/:repo/editProperties/:contentId?"
                render={() => <EditProperties />}
                authorize={() => true}
              />
              <AuthorizedRoute
                path="/:repo/preview/:documentId?"
                render={() => <DocumentViewerComponent />}
                authorize={() => true}
              />
              <Route path="/" render={() => <DashboardComponent />} />
            </Switch>
          ) : (
            <FullScreenLoader />
          )}
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}

const connectedComponent = withRouter(MainRouter)

export { connectedComponent as MainRouter }
