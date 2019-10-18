import { mount, shallow } from 'enzyme'
import React from 'react'
import { Repository } from '@sensenet/client-core'
import { Button } from '@material-ui/core'
import { App } from '../src/app'
import { RepositoryContext } from '../src/context/repository-provider'

describe('Layout', () => {
  it('Matches snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })

  it('should trigger logout on logout button click', () => {
    const repo = new Repository()
    repo.authentication.logout = jest.fn()
    const l = mount(
      <RepositoryContext.Provider value={repo}>
        <App />
      </RepositoryContext.Provider>,
    )

    const button = l.find(Button)
    ;(button.prop('onClick') as any)()

    expect(repo.authentication.logout).toBeCalled()
  })
})
