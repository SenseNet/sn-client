import { IconButton } from '@material-ui/core'
import { posToDOMRect, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
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

  it('should be exist IconButton', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(BubbleMenu).prop('editor')
    editorWrapper.isActive = jest.fn((value: string) => value === 'image')

    expect(editorWrapper?.isActive('image')).toBeTruthy()
    expect(wrapper.find(IconButton).exists()).toBeTruthy()
  })

  it('should be click IconButton', () => {
    const wrapper = mount(<Editor autofocus={true} />)
    const editorWrapper = wrapper.find(BubbleMenu).prop('editor')
    editorWrapper.isActive = jest.fn((value: string) => value === 'image')
    const chain = {
      focus: jest.fn(() => chain),
      deleteSelection: jest.fn(() => chain),
      run: jest.fn(() => chain),
      toggleBold: jest.fn(() => chain),
      toggleItalic: jest.fn(() => chain),
      toggleUnderline: jest.fn(() => chain),
      toggleBlockquote: jest.fn(() => chain),
      toggleCode: jest.fn(() => chain),
      setTextAlign: jest.fn(() => chain),
      toggleBulletList: jest.fn(() => chain),
      toggleOrderedList: jest.fn(() => chain),
      unsetAllMarks: jest.fn(() => chain),
      clearNodes: jest.fn(() => chain),
      undo: jest.fn(() => chain),
      redo: jest.fn(() => chain),
    }

    editorWrapper.chain = jest.fn(() => chain)

    console.log('jestIsTheBlh', wrapper.find(IconButton).at(14))
    wrapper.find(IconButton).at(14).simulate('click')

    expect(editorWrapper.chain).toBeCalled()
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
