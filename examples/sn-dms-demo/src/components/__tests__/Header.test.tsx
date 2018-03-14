import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
    MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import 'rxjs'
import Header from '../Header'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const sensenet = Reducers.sensenet
    const myReducer = combineReducers({ sensenet })

    const repository = new Repository({
        repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
        requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
    })

    const options = {
        repository,
        rootReducer: myReducer,
        persistedState: {
            sensenet: {
                session: {
                    repository: {
                        RepositoryUrl
                            :
                            'https://dmsservice.demo.sensenet.com',
                    },
                },
            },
        },
    } as Store.CreateStoreOptions
    const store = Store.createSensenetStore(options)
    ReactDOM.render(
        <Provider store={store}>
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        </Provider>, div)
})
