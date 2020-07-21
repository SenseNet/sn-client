import { LoadSettingsContextProvider } from '@sensenet/hooks-react'
import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { PATHS } from '../application-paths'
import { InvalidPathErrorBoundary } from './content/InvalidPathErrorBoundary'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './full-screen-loader'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ './content'))
const DashboardComponent = lazy(() => import(/* webpackChunkName: "dashboard" */ './dashboard'))
const UsersAndGroupsComponent = lazy(() => import(/* webpackChunkName: "users-and-groups" */ './users-and-groups'))
const SearchComponent = lazy(() => import(/* webpackChunkName: "search" */ './search'))
const SavedQueriesComponent = lazy(() => import(/* webpackChunkName: "saved-queries" */ './search/saved-queries'))
const SetupComponent = lazy(() => import(/* webpackChunkName: "setup" */ './setup/setup'))
const TrashComponent = lazy(() => import(/* webpackChunkName: "Trash" */ './trash/Trash'))
const EventListComponent = lazy(() => import(/* webpackChunkName: "EventList" */ './event-list/event-list'))
const CustomContent = lazy(() => import(/* webpackChunkName: "CustomContent" */ './content/CustomContent'))
const PersonalSettingsEditor = lazy(() =>
  import(/* webpackChunkName: "PersonalSettingsEditor" */ './edit/PersonalSettingsEditor'),
)

export const MainRouter = () => {
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
            <UsersAndGroupsComponent />
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
