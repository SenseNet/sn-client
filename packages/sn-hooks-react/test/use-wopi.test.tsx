import React from 'react'
import { shallow } from 'enzyme'
import { useWopi } from '../src/hooks'

const WopiDump = () => {
  const i = useWopi({ Id: 1, Path: '', Type: 'File', Name: 'aaa.txt' })
  return <div>{JSON.stringify(i.constructor.name)}</div>
}

describe('Wopi', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<WopiDump />)).toMatchSnapshot()
  })
})
