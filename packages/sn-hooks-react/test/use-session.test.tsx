import { shallow } from 'enzyme'
import React from 'react'
import { useSession } from '../src/hooks'

const SessionDump = () => {
  const i = useSession()
  return <div>{JSON.stringify(i.constructor)}</div>
}

describe('Session', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<SessionDump />)).toMatchSnapshot()
  })
})
