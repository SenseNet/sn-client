import React from 'react'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { CurrentContentProvider } from '../src/context/current-content'
import { RepositoryContext } from '../src/context'

describe('CurrentContent', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentContentProvider idOrPath={1} />)
    expect(p).toMatchSnapshot()
  })

  it('can be mounted', async () => {
    await act(async () => {
      const repo = new Repository(
        {},
        async () =>
          ({
            ok: true,
            json: async () => ({
              _d: {
                /** */
                Id: 1,
              },
            }),
          } as any),
      )
      mount(
        <RepositoryContext.Provider value={repo}>
          <CurrentContentProvider idOrPath={1} />
        </RepositoryContext.Provider>,
      )
    })
  })
})
