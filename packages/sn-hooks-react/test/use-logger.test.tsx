import React from 'react'
import { shallow } from 'enzyme'
import { useLogger } from '../src/hooks'

const LoggerDump = () => {
  const i = useLogger('testScope')
  return <div>{JSON.stringify(i)}</div>
}

describe('Injector', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<LoggerDump />)).toMatchSnapshot()
  })
})
