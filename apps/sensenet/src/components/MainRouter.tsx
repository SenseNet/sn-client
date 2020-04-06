import { LoadSettingsContextProvider } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './full-screen-loader'
import { WopiPage } from './wopi-page'

const UsersAndGroupsComponent = lazy(() =>
  import(/* webpackChunkName: "UserAndGroup" */ './users-and-groups/users-and-groups'),
)
const LocalizationComponent = lazy(() => import(/* webpackChunkName: "Localization" */ './localization/localization'))
const ExploreComponent = lazy(() => import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(() => import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(() => import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup/setup'))
const EditBinary = lazy(() => import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(() => import(/* webpackChunkName: "editProperties" */ './edit/edit-properties'))
const BrowseProperties = lazy(() => import(/* webpackChunkName: "browseProperties" */ './browse/browse-properties'))
const NewProperties = lazy(() => import(/* webpackChunkName: "newProperties" */ './new/new-properties'))
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
      <Suspense fallback={<FullScreenLoader />}>
        <Switch>
          <Route path="/personalSettings">
            <PersonalSettingsEditor />
          </Route>

          <Route path="/events/:eventGuid?">
            <EventListComponent />
          </Route>

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

          <Route path="/:repo/localization">
            <LocalizationComponent />
          </Route>

          <Route path="/:repo/usersAndGroups">
            <UsersAndGroupsComponent />
          </Route>

          <Route path="/:repo/editBinary/:contentId?">
            <EditBinary />
          </Route>

          <Route path="/:repo/editProperties/:contentId?">
            <EditProperties />
          </Route>

          <Route path="/:repo/browseProperties/:contentId?">
            <BrowseProperties />
          </Route>

          <Route path="/:repo/newProperties/:contentId?">
            <NewProperties />
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
    </ErrorBoundary>
  )
}
