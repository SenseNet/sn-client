import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { combineReducers } from 'redux'
import 'rxjs'
import * as DMSReducers from '../../Reducers'
import GoogleReCaptcha from '../GoogleReCaptcha'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const sensenet = Reducers.sensenet
    const register = DMSReducers.register
    const myReducer = combineReducers({ sensenet, register })

    const repository = new Repository({
        repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
        requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
    })

    const options = {
        repository,
        rootReducer: myReducer,
        persistedState: {
            register: {
                captcha: false,
            },
        },
    } as Store.CreateStoreOptions<any>
    const store = Store.createSensenetStore(options)
    ReactDOM.render(
        <GoogleReCaptcha store={store} />, div)
})
