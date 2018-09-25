import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { FontAwesomeIcon } from '../../../src/components/fontawesome/Icon'
import { Icon, iconType } from '../../../src/components/Icon'
/**
 * FontAwesome Icon Component tests
 */
export const fontawesomeIconTests: Mocha.Suite = describe('Icon component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        c = renderer.create(
            <FontAwesomeIcon
                iconName="workspace">
            </FontAwesomeIcon>)
    })
    it('Should render without crashing with fontSize', () => {
        c = renderer.create(
            <FontAwesomeIcon
                fontSize="default"
                iconName="workspace">
            </FontAwesomeIcon>)
    })
    it('Should render without crashing with color', () => {
        c = renderer.create(
            <FontAwesomeIcon
                color="primary"
                iconName="workspace">
            </FontAwesomeIcon>)
    })
    it('Should render without crashing with classes', () => {
        c = renderer.create(
            <FontAwesomeIcon
                classes={{}}
                iconName="workspace" >
            </FontAwesomeIcon >)
    })
    it('Should render without crashing with styles', () => {
        c = renderer.create(
            <FontAwesomeIcon
                style={{}}
                iconName="workspace" >
            </FontAwesomeIcon >)
    })
    it('Should render without crashing with onClick', () => {
        c = renderer.create(
            <FontAwesomeIcon
                onClick={(e) => console.log(e.target)}
                iconName="workspace" >
            </FontAwesomeIcon >)
    })
    it('Should render without crashing with children component', () => {
        c = renderer.create(
            <FontAwesomeIcon
                onClick={(e) => console.log(e.target)}
                iconName="workspace" >
                <Icon type={iconType.materialui} iconName="forward" />
            </FontAwesomeIcon >)
    })
})
