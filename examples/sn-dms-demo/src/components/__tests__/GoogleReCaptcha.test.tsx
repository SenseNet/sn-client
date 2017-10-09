import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store, Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import 'rxjs'
import GoogleReCaptcha from '../GoogleReCaptcha';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const sensenet = Reducers.sensenet;
    const register = DMSReducers.register;
    const myReducer = combineReducers({ sensenet, register })

    const repository = new Repository.SnRepository({
        RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
        RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
    });
    process.env.REACT_APP_RECAPTCHA_KEY = 'grergeger'
    repository.Config
    const store = Store.configureStore(myReducer, null, undefined, {
        register: {
            captcha: false
        }
    }, repository)
    ReactDOM.render(
        <GoogleReCaptcha store={store} />, div);
});