import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Icon, iconType } from '../../../src/components/Icon'
import { ImageIcon } from '../../../src/components/image/Icon'
/**
 * Image Icon Component tests
 */
export const imageIconTests: Mocha.Suite = describe('Icon component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        c = renderer.create(
            <ImageIcon
                size={16}
                style={{ marginLeft: 2 }}
                iconName="workspace">
            </ImageIcon>)
    })
    it('Should render without crashing without size param', () => {
        c = renderer.create(
            <ImageIcon
                iconName="workspace">
            </ImageIcon>)
    })
    it('Should render without crashing with onClick param', () => {
        c = renderer.create(
            <ImageIcon
                onClick={(e) => console.log(e.target)}
                iconName="workspace">
            </ImageIcon>)
    })
    it('Should render without crashing with overlay', () => {
        c = renderer.create(
            <ImageIcon
                iconName="workspace">
                <Icon type={iconType.materialui} iconName="forward" />
            </ImageIcon>)
    })
})
