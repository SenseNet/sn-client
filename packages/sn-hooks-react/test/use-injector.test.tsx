import React from 'react'
import { shallow } from 'enzyme'
import { useInjector } from '../src/hooks'

const InjectorDump = () => {
  const i = useInjector()
  return <div>{JSON.stringify(i)}</div>
}

describe('Injector', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<InjectorDump />)).toMatchSnapshot()
  })
})
