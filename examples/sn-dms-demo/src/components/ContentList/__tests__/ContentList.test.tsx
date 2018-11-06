import { LoginState, Repository } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { Reducers, Store } from '@sensenet/redux'
import { configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
// import * as React from 'react'
// import * as ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import {
//     MemoryRouter,
// } from 'react-router-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from '../../../Reducers'
// import ContentList from '../ContentList'

import { rootStateType } from '../../..'
import { dms } from '../../../Reducers'

configure({ adapter: new Adapter() })

const sensenet = Reducers.sensenet
const actionmenu = DMSReducers.actions
const myReducer = combineReducers({ sensenet, actionmenu, dms }) as any

const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL,
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
})

const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
        sensenet: {
            currentcontent: {
                contentState: {
                    isSaved: false,
                },
            },
            selected: {
                ids: [],
            },
            batchResponses: {
                response: null,
            },
            session: {
                country: '',
                language: '',
                loginState: LoginState.Pending,
                user: {
                    userName: 'aaa',
                },
                error: null,
                repository: null,
            },
            currentworkspace: null,
            currentitems: {
                isFetching: false,
            },
        },
        dms: {
            actionmenu: {
                open: false,
                actions: [],
            },
            rootId: 123,
            messagebar: {
                open: false,
            },
            breadcrumb: null,
            editedItemId: 1,
            editedFirst: null,
            currentId: 1,
            register: {
                email: 'cc@ccc.hu',
            },
            dialog: {
                isOpened: false,
            },
            isLoading: false,
            isSelectionModeOn: false,
            menu: {
                active: null,
            },
            toolbar: {
                actions: [],
            },
            uploads: null,
            viewer: null,
            workspaces: {
                favorites: [],
            },
        },
    },
} as Store.CreateStoreOptions<rootStateType>
const store = Store.createSensenetStore(options)

const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
store.dispatch({ type: 'REQUEST_CONTENT_SUCCESS', payload: [content] })

describe('<ContentList />', () => {
    it('renders without crashing', () => {
        // const div = document.createElement('div')

        // ReactDOM.render(
        //     <Provider store={store}>
        //         <MemoryRouter>
        //             <ContentList children={{ 123: { Id: 123 } }} />
        //         </MemoryRouter>
        //     </Provider>, div)
    })
})

describe('<ContentList /> methods', () => {

    // it('It should simulate ctlr key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, ctrlKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate shift key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate alt key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, altKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate space keydown event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 32 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter keydown event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 13 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowdown keypress event with shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 40, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowdown keypress event without shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 40, shiftKey: false })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowup keypress event with shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 38, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowup keypress event without shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 38, shiftKey: false })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter delete keypress event with shift', () => {
    //     const onKeyDown = sinon.spy();
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
    //             </MemoryRouter>
    //         </Provider>);
    //     const element = wrapper.find('tr').last();
    //     element.simulate('keyDown', { which: 46, shiftKey: true });
    //     expect(onKeyDown.called).toBeTruthy;
    // });

    // it('It should simulate enter delete keypress event without shift', () => {
    //     const onKeyDown = sinon.spy();
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
    //             </MemoryRouter>
    //         </Provider>);
    //     const element = wrapper.find('tr').last();
    //     element.simulate('keyDown', { which: 46, shiftKey: false });
    //     expect(onKeyDown.called).toBeTruthy;
    // });

    // it('It should simulate select all checkbox click event', () => {
    //     const handleSelectAllClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('input[type="checkbox"]').first()
    //     element.simulate('click')
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleSelectAllClick.called).toBeTruthy
    // })

    // it('It should simulate row click event', () => {
    //     const handleRowSingleClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('click')
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleRowSingleClick.called).toBeTruthy
    // })

    // it('It should simulate pressing enter on a row', () => {
    //     const handleRowDoubleClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('dblclick', { id: 1 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleRowDoubleClick.called).toBeTruthy
    // })
})
