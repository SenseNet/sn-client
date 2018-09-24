import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Icon, iconType } from '../../src/components/Icon'
/**
 * Page Component tests
 */
export const pageTests: Mocha.Suite = describe('Icon component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                type={iconType.materialui}
                iconName="workspace">
            </Icon>)
    })
    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                type={iconType.fontawesome}
                iconName="workspace">
            </Icon>)
    })
    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                type={iconType.flaticon}
                iconName="workspace">
            </Icon>)
    })
    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                type={iconType.image}
                iconName="workspace">
            </Icon>)
    })
    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                type={null}
                iconName="workspace">
            </Icon>)
    })
    it('Should render without crashing', () => {
        c = renderer.create(
            <Icon
                color="primary"
                fontSize="default"
                classes={{}}
                type={null}
                iconName="workspace">
            </Icon>)
    })
})
