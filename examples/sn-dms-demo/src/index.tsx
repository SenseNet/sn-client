import { addGoogleAuth } from '@sensenet/authentication-google'
import { JwtService } from '@sensenet/authentication-jwt'
import { Repository } from '@sensenet/client-core'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { Reducers, Store } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { customSchema } from './assets/schema'
import './index.css'
import * as DMSReducers from './Reducers'
import registerServiceWorker from './registerServiceWorker'
import Sensenet from './Sensenet'
import { initLog } from './store/actionlog/actions'
import { getViewerSettings } from './ViewerSettings'
export const repository = new Repository({
  repositoryUrl: process.env.REACT_APP_SERVICE_URL,
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions', 'Avatar', 'Owner', 'DisplayName', 'Locked', 'CheckedOutTo', 'Approvable'] as any,
  defaultExpand: ['Actions', 'Owner', 'CheckedOutTo'] as any,
  schemas: customSchema,
  sessionLifetime: 'expiration',
})

const jwt = new JwtService(repository)
const googleOauthProvider = addGoogleAuth(jwt, { clientId: '188576321252-cad8ho16mf68imajdvai6e2cpl3iv8ss.apps.googleusercontent.com' })

const viewerSettings = getViewerSettings(repository)

const sensenet = Reducers.sensenet
const dms = DMSReducers.dms
const repositoryEvents = new EventHub(repository)
const sensenetDocumentViewer = sensenetDocumentViewerReducer

const myReducer = combineReducers({
  sensenet,
  dms,
  sensenetDocumentViewer,
})

const di = new ReduxDiMiddleware()
di.setInjectable(repository)
di.setInjectable(viewerSettings)
di.setInjectable(repositoryEvents)

const options = {
  repository,
  rootReducer: myReducer,
  middlewares: [di.getMiddleware()],
  logger: true,
} as Store.CreateStoreOptions<any>
const store = Store.createSensenetStore(options)

store.dispatch(initLog())

export type rootStateType = ReturnType<typeof myReducer>

ReactDOM.render(
  <Provider store={store}>
    <Sensenet oAuthProvider={googleOauthProvider} />
  </Provider>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
