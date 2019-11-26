import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import MainPanel from '../src/components/mainpanel'
import { SharedContext } from '../src/context/shared-context'
import EventComponent from '../src/components/event'
import { CalendarTestEvent } from './mocks/test-objects'

describe('Mainpanel', () => {
  const content = CalendarTestEvent

  const shareobject = {
    openeditmodal: true,
    setOpeneditmodal: jest.fn(),
    setEvent: jest.fn(),
    opendisplaymodal: false,
    setOpendisplaymodal: jest.fn(),
    event: [content],
    refreshcalendar: true,
    setRefreshcalendar: jest.fn(),
    opennewmodal: true,
    setOpennewmodal: jest.fn(),
    setOpennoti: jest.fn(),
  }

  it('Mainpanel snapshot', async () => {
    const repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: [content] } } as any)
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <SharedContext.Provider value={shareobject as any}>
            <MainPanel />
          </SharedContext.Provider>
        </RepositoryContext.Provider>,
      )
    })
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(EventComponent)).toBeDefined()
    expect(wrapper.find('p').text()).toContain('at Budapest')
  })
})
