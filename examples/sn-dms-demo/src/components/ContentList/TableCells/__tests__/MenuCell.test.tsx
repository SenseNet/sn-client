import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store, Actions, Reducers } from 'sn-redux'
import { Content, ContentTypes, Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import MenuCell from '../MenuCell';
import 'rxjs'

it('renders without crashing', () => {
    const div = document.createElement('div');
    const sensenet = Reducers.sensenet;
    const myReducer = combineReducers({ sensenet })

    const repository = new Repository.SnRepository({
        RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
        RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
    });

    repository.Config
    const store = Store.configureStore(myReducer, null, undefined, {
        sensenet: {
            children: {
                entities: {
                    123: {
                        Id: 123
                    }
                }
            }
        }
    }, repository)
    const content = repository.CreateContent({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task);
    ReactDOM.render(<MenuCell
        store={store}
        content={content}
        isHovered={false}
        isSelected={true}
        actionMenuIsOpen={false} />, div);
});