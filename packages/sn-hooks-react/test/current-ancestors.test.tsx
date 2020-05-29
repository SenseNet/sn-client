import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { CurrentContentContext } from '../src/context'
import { CurrentAncestorsProvider } from '../src/context/current-ancestors'

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
