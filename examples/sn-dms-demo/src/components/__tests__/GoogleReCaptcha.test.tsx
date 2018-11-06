import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootStateType } from '../..'
import { withStore } from '../../__tests__/TestHelper'
import GoogleReCaptcha from '../GoogleReCaptcha'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const options = {
        persistedState: {
            dms: {
                register: {
                    captcha: false,
                },
            },
        },
    } as Store.CreateStoreOptions<rootStateType>

    ReactDOM.render(withStore(<GoogleReCaptcha />, options), div)
})
