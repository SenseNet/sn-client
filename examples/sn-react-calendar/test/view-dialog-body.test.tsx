import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React from 'react'
import { Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { ViewDialogBody } from '../src/components/view-dialog-body'
import { SharedContext } from '../src/context/shared-context'
import { CalendarTestEvent, CalendarTestEventAllDay } from './mocks/test-objects'

describe('ViewDialogBody', () => {
  const content = CalendarTestEvent
  const contentAllDay = CalendarTestEventAllDay
  const testprops = {
    content,
    dialogClose: true,
  }
  const testpropsAllday = {
    content: contentAllDay,
    dialogClose: true,
  }
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
  const shareobjectAllDay = {
    openeditmodal: true,
    setOpeneditmodal: jest.fn(),
    setEvent: jest.fn(),
    opendisplaymodal: false,
    setOpendisplaymodal: jest.fn(),
    event: contentAllDay,
    refreshcalendar: true,
    setRefreshcalendar: jest.fn(),
    opennewmodal: true,
    setOpennewmodal: jest.fn(),
    setOpennoti: jest.fn(),
  }

  it('Open dialog and remove event test', async () => {
    const repo = new Repository()
    repo.load = function load() {
      return Promise.resolve({ d: content } as any)
    }
    repo.delete = jest.fn()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <SharedContext.Provider value={shareobject as any}>
            <ViewDialogBody {...(testprops as any)} />
          </SharedContext.Provider>
        </RepositoryContext.Provider>,
      )
    })
    wrapper.update().find(IconButton).first().simulate('click')
    expect(wrapper.find('div#simple-dialog-title').text()).toEqual('Are you sure you want to delete it?')

    await act(async () => {
      wrapper.find(Button).first().simulate('click')
    })

    expect(shareobject.setRefreshcalendar).toBeCalledWith(!shareobject.refreshcalendar)
    expect(shareobject.setOpendisplaymodal).toBeCalledWith(false)
    expect(shareobject.setOpennoti).toBeCalledWith(true)
  })

  it('All Day event test', async () => {
    const repo = new Repository()
    repo.load = function load() {
      return Promise.resolve({ d: content } as any)
    }
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <SharedContext.Provider value={shareobjectAllDay as any}>
            <ViewDialogBody {...(testpropsAllday as any)} />
          </SharedContext.Provider>
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.find('div.MuiCardContent-root').text()).toContain('All day')
  })
})
