import { Repository } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { loadUser, OidcProvider } from 'redux-oidc'
import { defaultRepositoryConfig, dmsInjector } from './DmsRepository'
import './index.css'
// import registerServiceWorker from './registerServiceWorker'
import { Sensenet } from './Sensenet'
import { initLog } from './store/actionlog/actions'
import { rootReducer } from './store/rootReducer'
import { userManager } from './userManager'

const di = new ReduxDiMiddleware(dmsInjector)

const repository = new Repository(defaultRepositoryConfig)
const repositoryEvents = new EventHub(repository)

dmsInjector.setExplicitInstance(repository)
dmsInjector.setExplicitInstance(repositoryEvents)

const options = {
  repository,
  rootReducer,
  middlewares: [di.getMiddleware()],
  logger: true,
  devTools: true,
} as Store.CreateStoreOptions<any>
export const store = Store.createSensenetStore(options)

loadUser(store, userManager)

store.dispatch(initLog())

ReactDOM.render(
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <Sensenet />
    </OidcProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

// registerServiceWorker()
