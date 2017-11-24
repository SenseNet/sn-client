import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    MemoryRouter
} from 'react-router-dom'
import { Store, Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../../Reducers'
import { Repository, Content, ContentTypes } from 'sn-client-js'
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';
import 'rxjs'
import ContentList from '../ContentList';

import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon'

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const sensenet = Reducers.sensenet;
const actionmenu = DMSReducers.actions;
const myReducer = combineReducers({ sensenet, actionmenu })

const repository = new Repository.SnRepository({
    RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
});

repository.Config
const store = Store.configureStore(myReducer, null, undefined, {
    sensenet: {
        session: {
            repository: {
                RepositoryUrl
                :
                'https://dmsservice.demo.sensenet.com'
            }
        },
        children: {
            entities: {
                4466: {
                    Id: 4466,
                    _type: 'Folder'
                },
                4467: {
                    Id: 4467,
                    _type: 'Folder'
                },
                123: {
                    Id: 123,
                    _type: 'File'
                }
            },
            ids: [4466, 4467, 123]
        }
    },
    actionmenu: {
        actions: []
    }
}, repository)

const content = repository.CreateContent({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task);
store.dispatch(Actions.ReceiveContent([content], {}))

describe('<ContentList />', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');

        ReactDOM.render(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} />
                </MemoryRouter>
            </Provider>, div);
    });
});

describe('<ContentList /> methods', () => {

    it('It should simulate ctlr key is pressed event', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { keyCode: 13, ctrlKey: true });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate shift key is pressed event', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { keyCode: 13, shiftKey: true });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate alt key is pressed event', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { keyCode: 13, altKey: true });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate space keydown event', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 32 });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate enter keydown event', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 13 });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate enter arrowdown keypress event with shift', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 40, shiftKey: true });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate enter arrowdown keypress event without shift', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 40, shiftKey: false });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate enter arrowup keypress event with shift', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 38, shiftKey: true });
        expect(onKeyDown.called).toBeTruthy;
    });

    it('It should simulate enter arrowup keypress event without shift', () => {
        const onKeyDown = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('keyDown', { which: 38, shiftKey: false });
        expect(onKeyDown.called).toBeTruthy;
    });

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

    it('It should simulate select all checkbox click event', () => {
        const handleSelectAllClick = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onClick={handleSelectAllClick} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('input[type="checkbox"]').first();
        element.simulate('click');
        expect(handleSelectAllClick.called).toBeTruthy;
    });

    it('It should simulate row click event', () => {
        const handleRowSingleClick = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} onClick={handleRowSingleClick} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('click');
        expect(handleRowSingleClick.called).toBeTruthy;
    });

    it('It should simulate pressing enter on a row', () => {
        const handleRowDoubleClick = sinon.spy();
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList store={store} children={{ 123: { Id: 123 } }} doubleClick={handleRowDoubleClick} />
                </MemoryRouter>
            </Provider>);
        const element = wrapper.find('tr').last();
        element.simulate('dblclick', { id: 1 });
        expect(handleRowDoubleClick.called).toBeTruthy;
    });
})