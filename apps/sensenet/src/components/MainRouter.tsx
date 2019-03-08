import { LoginState } from '@sensenet/client-core'
import React, { lazy, Suspense, useContext } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { InjectorContext } from '../context/InjectorContext'
import { RepositoryContext } from '../context/RepositoryContext'
import { rootStateType } from '../store'
import { AuthorizedRoute } from './AuthorizedRoute'
import { ErrorBoundary } from './ErrorBoundary'
import { FullScreenLoader } from './FullScreenLoader'

const mapStateToProps = (state: rootStateType) => ({
  loginState: state.session.loginState,
  currentUser: state.session.currentUser,
  repositoryUrl: state.persistedState.lastRepositoryUrl,
})

const ExploreComponent = lazy(async () => await import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(async () => await import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(async () => await import(/* webpackChunkName: "search" */ './search'))
const IamComponent = lazy(async () => await import(/* webpackChunkName: "iam" */ './iam'))
const SetupComponent = lazy(async () => await import(/* webpackChunkName: "setup" */ './setup'))

const LoginComponent = lazy(async () => await import(/* webpackChunkName: "Login" */ './Login'))
const EditBinary = lazy(async () => await import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(async () => await import(/* webpackChunkName: "editProperties" */ './edit/EditProperties'))
const DocumentViewerComponent = lazy(async () => await import(/* webpackChunkName: "DocViewer" */ './DocViewer'))

const PersonalSettingsEditor = lazy(
  async () => await import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

const MainRouter: React.StatelessComponent<ReturnType<typeof mapStateToProps> & RouteComponentProps> = props => {
  const injector = useContext(InjectorContext)
  const repo = injector.getRepository(props.repositoryUrl)
  return (
    <ErrorBoundary>
      <RepositoryContext.Provider value={repo} />
      <Suspense fallback={<FullScreenLoader />}>
        {props.loginState === LoginState.Unauthenticated ? (
          <LoginComponent />
        ) : props.loginState === LoginState.Authenticated ? (
          <Switch>
            <AuthorizedRoute
              path="/content/:folderId?/:rightParent?"
              render={() => <ExploreComponent />}
              authorize={() => true}
            />
            <AuthorizedRoute path="/search" render={() => <SearchComponent />} authorize={() => true} />
            <AuthorizedRoute path="/iam" render={() => <IamComponent />} authorize={() => true} />
            <AuthorizedRoute path="/setup" render={() => <SetupComponent />} authorize={() => true} />
            <AuthorizedRoute path="/editBinary/:contentId?" render={() => <EditBinary />} authorize={() => true} />
            <AuthorizedRoute
              path="/editProperties/:contentId?"
              render={() => <EditProperties />}
              authorize={() => true}
            />
            <AuthorizedRoute
              path="/preview/:documentId?"
              render={() => <DocumentViewerComponent />}
              authorize={() => true}
            />
            <AuthorizedRoute
              path="/personalSettings"
              render={() => <PersonalSettingsEditor />}
              authorize={() => true}
            />
            <Route path="/" render={() => <DashboardComponent />} />
          </Switch>
        ) : (
          <FullScreenLoader />
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

const connectedComponent = withRouter(connect(mapStateToProps)(MainRouter))

export { connectedComponent as MainRouter }
