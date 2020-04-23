import { LoadSettingsContextProvider } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { applicationPaths } from '../application-paths'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './full-screen-loader'

const UsersAndGroupsComponent = lazy(() => import(/* webpackChunkName: "UserAndGroup" */ './users-and-groups'))
const LocalizationComponent = lazy(() => import(/* webpackChunkName: "Localization" */ './localization'))
const ContentTypes = lazy(() => import(/* webpackChunkName: "ContentTypes" */ './content-types'))
const WopiPage = lazy(() => import(/* webpackChunkName: "wopi" */ './wopi-page'))
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
const EventListComponent = lazy(() => import(/* webpackChunkName: "EventList" */ './event-list/event-list'))
const PersonalSettingsEditor = lazy(() =>
  import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

export const MainRouter = () => {
  const previousLocation = useRef<string>()
  const history = useHistory()

  useEffect(() => {
    const listen = history.listen((location) => {
      /**
       *  Do not add preview locations to previousLocation
       *  this way the user can go back to the location where she
       *  opened the viewer.
       * */
      if (location.pathname.includes(applicationPaths.preview)) {
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
          <Route path={applicationPaths.personalSettings}>
            <PersonalSettingsEditor />
          </Route>

          <Route path={`${applicationPaths.events}/:eventGuid?`}>
            <EventListComponent />
          </Route>

          <Route path="/browse/:browseData?">
            <ExploreComponent />
          </Route>

          <Route path="/search/:queryData?">
            <LoadSettingsContextProvider>
              <SearchComponent />
            </LoadSettingsContextProvider>
          </Route>

          <Route path={applicationPaths.savedQueries}>
            <LoadSettingsContextProvider>
              <SavedQueriesComponent />
            </LoadSettingsContextProvider>
          </Route>

          <Route path={applicationPaths.setup}>
            <SetupComponent />
          </Route>

          <Route path={applicationPaths.trash}>
            <TrashComponent />
          </Route>

          <Route path={applicationPaths.localization}>
            <LocalizationComponent />
          </Route>

          <Route path={applicationPaths.usersAndGroups}>
            <UsersAndGroupsComponent />
          </Route>

          <Route path={applicationPaths.contentTypes}>
            <ContentTypes />
          </Route>

          <Route path={`${applicationPaths.editBinary}/:contentId?`}>
            <EditBinary />
          </Route>

          <Route path={`${applicationPaths.editProperties}/:contentId?`}>
            <EditProperties />
          </Route>

          <Route path={`${applicationPaths.browseProperties}/:contentId?`}>
            <BrowseProperties />
          </Route>

          <Route path={applicationPaths.newProperties}>
            <NewProperties />
          </Route>

          <Route path={`${applicationPaths.preview}/:contentId?`}>
            <DocumentViewerComponent previousLocation={previousLocation.current} />
          </Route>

          <Route path={`${applicationPaths.wopi}/:contentId/:action?`}>
            <WopiPage />
          </Route>

          <Route path={`${applicationPaths.dashboard}/:dashboardName?`}>
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
