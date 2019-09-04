import React from 'react'
import { shallow } from 'enzyme'
import { RepositoryContext } from '../src/context/repository'

describe('Repository', () => {
  it('matches snapshot', () => {
    const p = shallow(<RepositoryContext.Consumer>{() => <></>}</RepositoryContext.Consumer>)
    expect(p).toMatchSnapshot()
  })
})
