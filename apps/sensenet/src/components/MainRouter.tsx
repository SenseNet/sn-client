import { LoadSettingsContextProvider, RepositoryContext } from '@sensenet/hooks-react'
import React, { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { ErrorBoundary } from './error-boundary'
import { ErrorBoundaryWithDialogs } from './error-boundary-with-dialogs'
import { FullScreenLoader } from './FullScreenLoader'
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
              <DocumentViewerComponent previousLocation={previousLocation.current} />{' '}
            </Route>

            <Route path="/:repo/wopi/:documentId/:action?">
              <WopiPage />
            </Route>

            <Route path="/:repo/dashboard/:dashboardName?">
              <RepositoryContext.Consumer>
                {repo => <DashboardComponent repository={repo} />}
              </RepositoryContext.Consumer>
            </Route>

            <Route path="/:repo/" exact>
              <DesktopLayout>
                <RepositoryContext.Consumer>
                  {repo => <DashboardComponent repository={repo} />}
                </RepositoryContext.Consumer>
              </DesktopLayout>
            </Route>

            <Route path="/" exact>
              <DesktopLayout>
                <DashboardComponent />
              </DesktopLayout>
            </Route>
          </Switch>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
