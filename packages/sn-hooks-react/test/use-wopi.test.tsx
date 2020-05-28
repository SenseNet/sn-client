import { GenericContent } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import React from 'react'
import { useWopi } from '../src/hooks'

const Wopi = ({ content }: { content: GenericContent }) => {
  const { isReadAvailable, isWriteAvailable } = useWopi()
  return (
    <>
      {isReadAvailable(content) ? <p>Read is available</p> : null}
      {isWriteAvailable(content) ? <p>Write is available</p> : null}
    </>
  )
}

describe('useWopi hook', () => {
  it('should allow edit based on available action', () => {
    const content = {
      Type: 'File',
      Actions: [{ Name: 'WopiOpenEdit' }],
    }
    const wrapper = shallow(<Wopi content={content as any} />)
    expect(wrapper.find('p').length).toBe(2)
  })

  it('should allow view based on available action', () => {
    const content = {
      Type: 'File',
      Actions: [{ Name: 'WopiOpenView' }],
    }
    const wrapper = shallow(<Wopi content={content as any} />)
    expect(wrapper.find('p').length).toBe(1)
  })

  it('should not show any wopiaction based on available action', () => {
    const content = {
      Type: 'File',
      Actions: [{ Name: 'Browse' }],
    }
    const wrapper = shallow(<Wopi content={content as any} />)
    expect(wrapper.find('p').length).toBe(0)
  })

  it('should not show any wopiaction when content type is not file', () => {
    const content = {
      Type: 'Task',
      Actions: [{ Name: 'Browse' }],
    }
    const wrapper = shallow(<Wopi content={content as any} />)
    expect(wrapper.find('p').length).toBe(0)
  })
})
