import { expect } from 'chai'
import { isPromise } from '../src/IsPromise'

// tslint:disable:completed-docs

export const isPromiseTest: Mocha.Suite = describe('IsPromise', () => {
    it('Returns true with a Promise as a param', () => {
        const promise = new Promise((resolve) => {
            setTimeout(resolve, 100, 'foo')
        })
        // tslint:disable-next-line:no-unused-expression
        expect(isPromise(promise)).to.be.true
    })
    it('Returns false with a non-Promise param', () => {
        // tslint:disable-next-line:no-unused-expression
        expect(isPromise({})).to.be.false
    })
})
