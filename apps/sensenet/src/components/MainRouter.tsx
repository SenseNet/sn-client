import { LoadSettingsContextProvider } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './FullScreenLoader'
import { WopiPage } from './wopi-page'

const ExploreComponent = lazy(() => import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(() => import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(() => import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup/setup'))
const EditBinary = lazy(() => import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(() => import(/* webpackChunkName: "editProperties" */ './edit/EditProperties'))
const DocumentViewerComponent = lazy(() => import(/* webpackChunkName: "DocViewer" */ './DocViewer'))
const TrashComponent = lazy(() => import(/* webpackChunkName: "Trash" */ './trash/Trash'))
const EventListComponent = lazy(() => import(/* webpackChunkName: "EventList" */ './event-list'))
const PersonalSettingsEditor = lazy(() =>
  import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
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
          <Route path="/personalSettings">
            <PersonalSettingsEditor />
          </Route>
          <Route path="/events/:eventGuid?">
            <EventListComponent />
          </Route>
          <Switch>
            <Route path="/:repo/browse/:browseData?">
              <ExploreComponent />
            </Route>

            <Route path="/:repo/search/:queryData?">
              <LoadSettingsContextProvider>
                <SearchComponent />
              </LoadSettingsContextProvider>
            </Route>

            <Route path="/:repo/saved-queries">
              <LoadSettingsContextProvider>
                <SavedQueriesComponent />
              </LoadSettingsContextProvider>
            </Route>

            <Route path="/:repo/setup">
              <SetupComponent />
            </Route>

            <Route path="/:repo/trash">
              <TrashComponent />
            </Route>

            <Route path="/:repo/editBinary/:contentId?">
              <EditBinary />
            </Route>

            <Route path="/:repo/editProperties/:contentId?">
              <EditProperties />
            </Route>

            <Route path="/:repo/preview/:documentId?">
              <DocumentViewerComponent previousLocation={previousLocation.current} />
            </Route>

            <Route path="/:repo/wopi/:documentId/:action?">
              <WopiPage />
            </Route>

            <Route path="/dashboard/:dashboardName?">
              <DashboardComponent />
            </Route>

            <Route path="/" exact>
              <DashboardComponent />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
