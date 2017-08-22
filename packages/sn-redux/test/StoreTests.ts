import * as Chai from 'chai';
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable';
import { Repository } from 'sn-client-js'
import { Store } from '../src/Store'
import { Reducers } from '../src/Reducers'
import { Epics } from '../src/Epics'
const expect = Chai.expect;
import 'rxjs';

describe('Store', () => {
    const repository = new Repository.SnRepository();
    const loggerMiddleware = createLogger();
    const epicMiddleware = createEpicMiddleware(Epics.rootEpic, { dependencies: { repository } });
    const middlewareArray = [];
    middlewareArray.push(epicMiddleware);
    middlewareArray.push(loggerMiddleware);
    const store = createStore(
        Reducers.sensenet,
        {},
        applyMiddleware(...middlewareArray)
    )
    it('should return a redux store', () => {
        expect(typeof Store.configureStore()).to.be.equal(typeof store)
    });
    it('should return a redux store', () => {
        expect(typeof Store.configureStore(Reducers.sensenet)).to.be.equal(typeof store)
    });
    it('should return a redux store', () => {
        expect(typeof Store.configureStore(Reducers.sensenet, null, null, {})).to.be.equal(typeof store)
    });
    it('should return a redux store', () => {
        expect(typeof Store.configureStore(Reducers.sensenet, Epics.rootEpic)).to.be.equal(typeof store)
    });
    it('should return a redux store', () => {
        expect(typeof Store.configureStore(Reducers.sensenet, null, [])).to.be.equal(typeof store)
    });
    it('should return a redux store', () => {
        expect(typeof Store.configureStore(Reducers.sensenet, null, null, {}, repository)).to.be.equal(typeof store)
    });
});