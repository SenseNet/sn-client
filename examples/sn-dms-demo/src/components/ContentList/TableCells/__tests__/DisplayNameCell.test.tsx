import { Repository } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineReducers } from 'redux'
import DisplayNameCell from '../DisplayNameCell'

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
                currentcontent: {
                    Id: 1,
                },
            },
        },
    } as Store.CreateStoreOptions<any>
    const store = Store.createSensenetStore(options)
    const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
    ReactDOM.render(<DisplayNameCell
        store={store}
        content={content}
        isHovered={false}
        handleRowDoubleClick={() => {
            //
        }}
        handleRowSingleClick={() => {
            //
        }} />, div)
})
