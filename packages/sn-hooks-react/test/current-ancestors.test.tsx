import React from 'react'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { CurrentAncestorsProvider } from '../src/context/current-ancestors'
import { CurrentContentContext } from '../src/context'

describe('CurrentAncestors', () => {
  it('matches snapshot', () => {
    const p = shallow(<CurrentAncestorsProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Does not fetch if the currentContent equals root', async () => {
    await act(async () => {
      const mockContent = { Id: 123, Path: '/Root/Content', Type: 'Folder', Name: 'Folder' }
      mount(
        <CurrentContentContext.Provider value={{ ...mockContent }}>
          <CurrentAncestorsProvider root={mockContent.Id} />
        </CurrentContentContext.Provider>,
      )
    })
  })

  it('Tries to load ancestors', async () => {
    await act(async () => {
      mount(
        <CurrentAncestorsProvider>
          <div>a</div>
        </CurrentAncestorsProvider>,
      )
    })
  })
})
