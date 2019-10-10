import { shallow } from 'enzyme'
import React from 'react'
import { RepositoryProvider } from '../src/context/repository-provider'

describe('Repository Context Provider', () => {
  it('Matches snapshot', () => {
    const l = shallow(
      <RepositoryProvider>
        <>test</>
      </RepositoryProvider>,
    )
    expect(l).toMatchSnapshot()
  })
})
