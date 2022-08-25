import { IconButton } from '@material-ui/core'
import { posToDOMRect, BubbleMenu as TiptapBubbleMenu, Editor as TipTapEditor } from '@tiptap/react'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Editor } from '../src/components/editor'
import { BubbleMenu } from './../src/components/bubble-menu'
import { mockInstance } from './__mocks__/mokInstance'

describe('BubbleMenu', () => {
  it('should be rendered BubbleMenu', () => {
    const wrapper = mount(<Editor />)
    expect(wrapper.find(BubbleMenu).exists()).toBeTruthy()
  })

  it('should not be rendered BubbleMenu if image is not active', () => {
    const editor = {
      isActive: jest.fn((value: string) => value === 'image'),
      registerPlugin: jest.fn(),
    } as unknown as TipTapEditor
    const wrapper = mount(<BubbleMenu editor={editor} />)

    expect(wrapper.find(TiptapBubbleMenu).find(IconButton).exists()).toBeTruthy()
  })

  it(`should call chain function on clicking IconButton with type 'image'`, () => {
    const chain = {
      focus: jest.fn(() => chain),
      deleteSelection: jest.fn(() => chain),
      run: jest.fn(() => chain),
      unsetLink: jest.fn(() => chain),
    }
    const editor = {
      isActive: jest.fn((value: string) => value === 'image'),
      registerPlugin: jest.fn(),
      chain: jest.fn(() => chain),
    } as unknown as TipTapEditor
    const wrapper = mount(<BubbleMenu editor={editor} />)

    wrapper.find(TiptapBubbleMenu).find(IconButton).simulate('click')

    expect(editor.chain).toBeCalled()
    expect(chain.focus).toBeCalled()
    expect(chain.deleteSelection).toBeCalled()
    expect(chain.run).toBeCalled()
  })

  it(`should call chain function on clicking IconButton with type 'link'`, () => {
    const chain = {
      focus: jest.fn(() => chain),
      run: jest.fn(() => chain),
      unsetLink: jest.fn(() => chain),
    }
    const editor = {
      isActive: jest.fn((value: string) => value === 'link'),
      registerPlugin: jest.fn(),
      chain: jest.fn(() => chain),
      getAttributes: jest.fn((href: string) => href),
    } as unknown as TipTapEditor
    const wrapper = mount(<BubbleMenu editor={editor} />)

    wrapper.find(TiptapBubbleMenu).find(IconButton).simulate('click')

    expect(editor.chain).toBeCalled()
    expect(chain.focus).toBeCalled()
    expect(chain.unsetLink).toBeCalled()
    expect(chain.run).toBeCalled()
  })

  it('should not be rendered BubbleMenu if link is not active', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(BubbleMenu).prop('editor')

    expect(editorWrapper?.isActive('link')).toBe(false)
  })

  it('should be rendered TiptapBubbleMenu', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu)

    expect(editorWrapper).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu delay 100', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('tippyOptions')

    expect(editorWrapper?.delay).toBe(100)
  })

  it('should be TiptapBubbleMenu show udnefined', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('tippyOptions')

    expect((editorWrapper as any).onShow(mockInstance)).toBeUndefined()
  })

  it('should be TiptapBubbleMenu editor from and to variables not undefined ', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')
    const { state } = editorWrapper.view
    const { selection } = state
    const { ranges } = selection

    const from = Math.min(...ranges.map((range) => range.$from.pos))
    const to = Math.max(...ranges.map((range) => range.$to.pos))

    mockInstance.setProps({
      getReferenceClientRect: () => posToDOMRect(editorWrapper.view, from, to),
    })

    expect(from).not.toBeUndefined()
    expect(to).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu editor setProps not undefined ', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')
    const { state } = editorWrapper.view
    const { selection } = state
    const { ranges } = selection

    const from = Math.min(...ranges.map((range) => range.$from.pos))
    const to = Math.max(...ranges.map((range) => range.$to.pos))

    const testSetProps = mockInstance.setProps({
      getReferenceClientRect: () => posToDOMRect(editorWrapper.view, from, to),
    })

    expect(testSetProps).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu editor view not undefined ', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')

    expect(editorWrapper.view).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu state not undefined ', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')
    const { state } = editorWrapper.view

    expect(state).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu selection not undefined ', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')
    const { state } = editorWrapper.view
    const { selection } = state

    expect(selection).not.toBeUndefined()
  })

  it('should be TiptapBubbleMenu ranges not undefined', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(TiptapBubbleMenu).prop('editor')
    const { state } = editorWrapper.view
    const { selection } = state
    const { ranges } = selection

    expect(ranges).not.toBeUndefined()
  })

  it('should be IconButton rendered', () => {
    const wrapper = mount(<IconButton />)
    expect(wrapper).not.toBeUndefined()
  })

  it('should be IconButton click', async () => {
    const click = jest.fn()
    let wrapper: any

    await act(async () => {
      wrapper = mount(<IconButton onClick={click} />)
    })
    wrapper.update()
    wrapper.simulate('click')

    expect(click).toBeCalled()
  })
})
