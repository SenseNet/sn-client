import { shallow } from 'enzyme'
import React from 'react'
import { useRepository } from '../src/hooks'

const RepoDump = () => {
  const i = useRepository()
  return <div>{JSON.stringify(i.constructor.name)}</div>
}

describe('Repository', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<RepoDump />)).toMatchSnapshot()
  })
})
