import { LoadSettingsContextProvider } from '@sensenet/hooks-react'
import { Location } from 'history'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { matchPath, Route, Switch, useHistory } from 'react-router-dom'
import { PATHS } from '../application-paths'
import { InvalidPathErrorBoundary } from './content/InvalidPathErrorBoundary'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './full-screen-loader'

const WopiPage = lazy(() => import(/* webpackChunkName: "wopi" */ './wopi-page'))
const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(() => import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(() => import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup/setup'))
const EditBinary = lazy(() => import(/* webpackChunkName: "editBinary" */ './edit/EditBinary'))
const EditProperties = lazy(() => import(/* webpackChunkName: "editProperties" */ './edit/edit-properties'))
const BrowseProperties = lazy(() => import(/* webpackChunkName: "browseProperties" */ './browse/browse-properties'))
const NewProperties = lazy(() => import(/* webpackChunkName: "newProperties" */ './new/new-properties'))
const VersionProperties = lazy(() => import(/* webpackChunkName: "versionProperties" */ './version/version-properties'))
const DocumentViewerComponent = lazy(() => import(/* webpackChunkName: "DocViewer" */ './DocViewer'))
const TrashComponent = lazy(() => import(/* webpackChunkName: "Trash" */ './trash/Trash'))
const EventListComponent = lazy(() => import(/* webpackChunkName: "EventList" */ './event-list/event-list'))
const CustomContent = lazy(() => import(/* webpackChunkName: "CustomContent" */ './content/CustomContent'))
const PersonalSettingsEditor = lazy(() =>
  import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

export const MainRouter = () => {
  const previousLocation = useRef<Location>()
  const history = useHistory()

  useEffect(() => {
    const listen = history.listen((location) => {
      /**
       *  Do not add preview locations to previousLocation
       *  this way the user can go back to the location where she
       *  opened the viewer.
       * */
      if (matchPath(location.pathname, PATHS.preview.appPath)) {
        return
      }
      previousLocation.current = location
    })
    return () => {
      listen()
    }
  }, [history])

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryWithDialogs}>
      <Suspense fallback={<FullScreenLoader />}>
        <Switch>
          <Route path={PATHS.personalSettings.appPath}>
            <PersonalSettingsEditor />
          </Route>

          <Route path={PATHS.events.appPath}>
            <EventListComponent />
          </Route>

          <Route path={PATHS.content.appPath}>
            <InvalidPathErrorBoundary>
              <ContentComponent />
            </InvalidPathErrorBoundary>
          </Route>

          <Route path={PATHS.search.appPath}>
            <LoadSettingsContextProvider>
              <SearchComponent />
            </LoadSettingsContextProvider>
          </Route>

          <Route path={PATHS.savedQueries.appPath}>
            <LoadSettingsContextProvider>
              <SavedQueriesComponent />
            </LoadSettingsContextProvider>
          </Route>

          <Route path={PATHS.setup.appPath}>
            <SetupComponent />
          </Route>

          <Route path={PATHS.trash.appPath}>
            <TrashComponent />
          </Route>

          <Route path={PATHS.localization.appPath}>
            <ContentComponent rootPath={PATHS.localization.snPath} />
          </Route>

          <Route path={PATHS.usersAndGroups.appPath}>
            <ContentComponent
              rootPath={PATHS.usersAndGroups.snPath}
              fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']}
            />
          </Route>

          <Route path={PATHS.contentTypes.appPath}>
            <ContentComponent
              rootPath={PATHS.contentTypes.snPath}
              fieldsToDisplay={[
                'DisplayName',
                'Description',
                'ParentTypeName' as any,
                'ModificationDate',
                'ModifiedBy',
              ]}
              loadChildrenSettings={{
                select: ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy'],
                query: "+TypeIs:'ContentType' .AUTOFILTERS:OFF",
              }}
            />
          </Route>

          <Route path={PATHS.editBinary.appPath}>
            <EditBinary />
          </Route>

          <Route path={PATHS.editProperties.appPath}>
            <EditProperties />
          </Route>

          <Route path={PATHS.browseProperties.appPath}>
            <BrowseProperties />
          </Route>

          <Route path={PATHS.newProperties.appPath}>
            <NewProperties />
          </Route>

          <Route path={PATHS.versionProperties.appPath}>
            <VersionProperties />
          </Route>

          <Route path={PATHS.preview.appPath}>
            <DocumentViewerComponent previousLocation={previousLocation.current} />
          </Route>

          <Route path={PATHS.wopi.appPath}>
            <WopiPage />
          </Route>

          <Route path={PATHS.dashboard.appPath}>
            <DashboardComponent />
          </Route>

          <Route path={PATHS.custom.appPath}>
            <CustomContent />
          </Route>

          <Route path="/" exact>
            <DashboardComponent />
          </Route>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}
