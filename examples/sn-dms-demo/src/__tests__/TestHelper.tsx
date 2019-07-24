import { Repository } from '@sensenet/client-core'
import { commentsStateReducer, rootReducer as sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Reducers, Store } from '@sensenet/redux'

import { CreateStoreOptions } from '@sensenet/redux/dist/Store'
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { dms } from '../Reducers'
import { rootStateType } from '../store/rootReducer'

it('Should help tests', () => {
  /** */
})

export const withStore = (component: JSX.Element, options?: Partial<CreateStoreOptions<rootStateType>>) => {
  const myReducer = combineReducers({
    sensenet: Reducers.sensenet,
    dms,
    sensenetDocumentViewer: sensenetDocumentViewerReducer,
    comments: commentsStateReducer,
  })
  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL,
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
  })
  const defaultOptions = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      sensenet: {
        session: {
          repository: {
            RepositoryUrl: 'https://dmsservice.demo.sensenet.com',
          },
        },
      },
    },
  }
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  const store = Store.createSensenetStore({ ...defaultOptions, ...options } as CreateStoreOptions<rootStateType>)

  return <Provider store={store}>{component}</Provider>
}
