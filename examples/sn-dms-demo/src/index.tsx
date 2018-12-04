import { Injector } from '@furystack/inject'
import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { Repository } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import 'reflect-metadata'
import './DmsRepository'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import Sensenet from './Sensenet'
import { initLog } from './store/actionlog/actions'
import { rootReducer } from './store/rootReducer'
import { getViewerSettings } from './ViewerSettings'

const repository = Injector.Default.GetInstance(Repository)

const viewerSettings = getViewerSettings(repository)

const di = new ReduxDiMiddleware(Injector.Default)
di.setInjectable(viewerSettings)

const options = {
  repository,
  rootReducer,
  middlewares: [di.getMiddleware()],
  // logger: true,
} as Store.CreateStoreOptions<any>
const store = Store.createSensenetStore(options)

store.dispatch(initLog())

ReactDOM.render(
  <Provider store={store}>
    <Sensenet oAuthProvider={Injector.Default.GetInstance(GoogleOauthProvider)} />
  </Provider>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
