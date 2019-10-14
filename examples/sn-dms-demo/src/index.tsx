import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { Repository } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { RepositoryContext } from '@sensenet/hooks-react'
import { dmsInjector } from './DmsRepository'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import Sensenet from './Sensenet'
import { initLog } from './store/actionlog/actions'
import { rootReducer } from './store/rootReducer'

const repository = dmsInjector.getInstance(Repository)

const di = new ReduxDiMiddleware(dmsInjector)

const options = {
  repository,
  rootReducer,
  middlewares: [di.getMiddleware()],
  logger: true,
} as Store.CreateStoreOptions<any>
const store = Store.createSensenetStore(options)

store.dispatch(initLog())

ReactDOM.render(
  <Provider store={store}>
    <RepositoryContext.Provider value={repository}>
      <Sensenet oAuthProvider={dmsInjector.getInstance(GoogleOauthProvider)} />
    </RepositoryContext.Provider>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

// expose repository when run in Cypress
if ((window as any).Cypress) {
  ;(window as any).repository = repository
}

registerServiceWorker()
