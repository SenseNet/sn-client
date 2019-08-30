import React from 'react'
import { shallow } from 'enzyme'
import { useVersionInfo } from '../src/hooks'

const VersionInfoDump = () => {
  const i = useVersionInfo()
  return <div>{JSON.stringify(i.constructor.name)}</div>
}

describe('Version Info', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<VersionInfoDump />)).toMatchSnapshot()
  })
})
