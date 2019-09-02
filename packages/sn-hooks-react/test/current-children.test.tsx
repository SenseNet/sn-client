import React from 'react'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { CurrentChildrenProvider } from '../src/context/current-children'
import { RepositoryContext } from '../src/context'

describe('CurrentChildren', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentChildrenProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Can be mounted', async () => {
    await act(async () => {
      const repo = new Repository(
        {},
        async () =>
          ({
            ok: true,
            json: async () => ({
              d: {
                results: [{ Id: 1 }],
              },
            }),
          } as any),
      )
      mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentChildrenProvider />
        </RepositoryContext.Provider>,
      )
    })
  })
})
