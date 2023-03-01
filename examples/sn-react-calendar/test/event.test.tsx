import ListItem from '@material-ui/core/ListItem'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import EventComponent from '../src/components/event'
import { SharedContext } from '../src/context/shared-context'
import { CalendarTestEvent } from './mocks/test-objects'

describe('Eventcomponent testing', () => {
  const claevent2 = { ...CalendarTestEvent, Id: 1351321, Name: 'Event 2' }
  const testprops = { event: [CalendarTestEvent, claevent2] }
  const content = CalendarTestEvent
  const shareobject = {
    openeditmodal: true,
    setOpeneditmodal: jest.fn(),
    setEvent: jest.fn(),
    opendisplaymodal: false,
    setOpendisplaymodal: jest.fn(),
    event: content,
    refreshcalendar: true,
    setRefreshcalendar: jest.fn(),
    opennewmodal: true,
    setOpennewmodal: jest.fn(),
    setOpennoti: jest.fn(),
  }

  it('Onclick test', async () => {
    const repo = new Repository()
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <SharedContext.Provider value={shareobject as any}>
            <EventComponent {...(testprops as any)} />
          </SharedContext.Provider>
        </RepositoryContext.Provider>,
      )
    })

    const listitem = wrapper.update().find(ListItem).first()

    listitem.simulate('click')
    expect(shareobject.setEvent).toBeCalledWith({ ...content })
    expect(shareobject.setOpendisplaymodal).toBeCalledWith(true)
  })
})
