import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { FlatIcon } from '../../../src/components/flaticon/Icon'
/**
 * Flat Icon Component tests
 */
export const flatIconTests: Mocha.Suite = describe('Icon component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        c = renderer.create(
            <FlatIcon
                iconName="workspace">
            </FlatIcon>)
    })
    it('Should render without crashing with fontSize', () => {
        c = renderer.create(
            <FlatIcon
                fontSize="default"
                iconName="workspace">
            </FlatIcon>)
    })
    it('Should render without crashing with color', () => {
        c = renderer.create(
            <FlatIcon
                color="primary"
                iconName="workspace">
            </FlatIcon>)
    })
    it('Should render without crashing with classes', () => {
        c = renderer.create(
            <FlatIcon
                classes={{}}
                iconName="workspace" >
            </FlatIcon >)
    })
    it('Should render without crashing with styles', () => {
        c = renderer.create(
            <FlatIcon
                style={{}}
                iconName="workspace" >
            </FlatIcon >)
    })
    it('Should render without crashing with onClick', () => {
        c = renderer.create(
            <FlatIcon
                onClick={(e) => console.log(e.target)}
                iconName="workspace" >
            </FlatIcon >)
    })
})
