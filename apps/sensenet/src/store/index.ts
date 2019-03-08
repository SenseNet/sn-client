import { Injector } from '@furystack/inject'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { commander } from './Commander'
import { commandPalette } from './CommandPalette'
import { drawer } from './Drawer'
import { editContent } from './EditContent'
import { loadedContentCache } from './LoadedContentCache'
import { persistedState } from './PersistedState'
import { setupRepositoryServices } from './RepositoryServices'
import { session } from './Session'
const sensenetDocumentViewer = sensenetDocumentViewerReducer

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  session,
  drawer,
  persistedState,
  loadedContentCache,
  commandPalette,
  editContent,
  sensenetDocumentViewer,
  commander,
})

export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(Injector.Default)

const persistedStateFromStorage = localStorage.getItem('sensenet-admin')
const persistedStateParsed = persistedStateFromStorage
  ? { persistedState: persistedStateFromStorage && JSON.parse(persistedStateFromStorage) }
  : {}

export const store = createStore(
  rootReducer,
  persistedStateParsed,
  composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())),
)

setupRepositoryServices({
  store,
  injector: Injector.Default,
  repositoryConfig: {
    sessionLifetime: 'expiration',
    repositoryUrl: store.getState().persistedState.lastRepositoryUrl,
    requiredSelect: [
      'Id',
      'Path',
      'Name',
      'Type',
      'DisplayName',
      'Icon',
      'IsFolder',
      'ParentId',
      'Version',
      'PageCount' as any,
      'Binary',
    ],
  },
})
