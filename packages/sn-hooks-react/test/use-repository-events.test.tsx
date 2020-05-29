import { shallow } from 'enzyme'
import React from 'react'
import { useRepositoryEvents } from '../src/hooks'

const RepoEventsDump = () => {
  const i = useRepositoryEvents()
  return <div>{JSON.stringify(i.constructor.name)}</div>
}

describe('Repository Events', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<RepoEventsDump />)).toMatchSnapshot()
  })
})
