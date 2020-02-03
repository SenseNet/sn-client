import { LoadSettingsContextProvider, RepositoryContext } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Switch, useHistory } from 'react-router'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './FullScreenLoader'
import AuthorizedRoute from './login/authorized-route'
import { WopiPage } from './wopi-page'
import { DesktopLayout } from './layout/DesktopLayout'

const ExploreComponent = lazy(async () => await import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(async () => await import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(async () => await import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(
  async () => await import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'),
)
const SetupComponent = lazy(async () => await import(/* webpackChunkName: "setup" */ './setup'))

const EditBinary = lazy(async () => await import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(async () => await import(/* webpackChunkName: "editProperties" */ './edit/EditProperties'))
const DocumentViewerComponent = lazy(async () => await import(/* webpackChunkName: "DocViewer" */ './DocViewer'))

const TrashComponent = lazy(async () => await import(/* webpackChunkName: "Trash" */ './trash/Trash'))
const EventListComponent = lazy(async () => await import(/* webpackChunkName: "EventList" */ './event-list'))

const PersonalSettingsEditor = lazy(
  async () => await import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

export const MainRouter = () => {
  const previousLocation = useRef<string>()
  const history = useHistory()

  useEffect(() => {
    const listen = history.listen(location => {
      /**
       *  Do not add preview locations to previousLocation
       *  this way the user can go back to the location where she
       *  opened the viewer.
       * */
      if (location.pathname.includes('/Preview')) {
        return
      }
      previousLocation.current = location.pathname
    })
    return () => {
      listen()
    }
  }, [history])

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryWithDialogs}>
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
        <Suspense fallback={<FullScreenLoader />}>
          <AuthorizedRoute path="/personalSettings">
            <PersonalSettingsEditor />
          </AuthorizedRoute>
          <AuthorizedRoute path="/events/:eventGuid?">
            <EventListComponent />
          </AuthorizedRoute>
          <Switch>
            <AuthorizedRoute path="/:repo/browse/:browseData?">
              <ExploreComponent />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/search/:queryData?">
              <LoadSettingsContextProvider>
                <SearchComponent />
              </LoadSettingsContextProvider>
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/saved-queries">
              <LoadSettingsContextProvider>
                <SavedQueriesComponent />
              </LoadSettingsContextProvider>
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/setup">
              <SetupComponent />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/trash">
              <TrashComponent />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/editBinary/:contentId?">
              <EditBinary />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/editProperties/:contentId?">
              <EditProperties />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/preview/:documentId?">
              <DocumentViewerComponent previousLocation={previousLocation.current} />{' '}
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/wopi/:documentId/:action?">
              <WopiPage />
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/dashboard/:dashboardName?">
              <RepositoryContext.Consumer>
                {repo => <DashboardComponent repository={repo} />}
              </RepositoryContext.Consumer>
            </AuthorizedRoute>

            <AuthorizedRoute path="/:repo/" exact>
              <DesktopLayout>
                <RepositoryContext.Consumer>
                  {repo => <DashboardComponent repository={repo} />}
                </RepositoryContext.Consumer>
              </DesktopLayout>
            </AuthorizedRoute>

            <AuthorizedRoute path="/" exact>
              <DesktopLayout>
                <DashboardComponent />
              </DesktopLayout>
            </AuthorizedRoute>
          </Switch>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
