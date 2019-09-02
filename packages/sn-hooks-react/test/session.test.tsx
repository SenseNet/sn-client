import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { SessionContextProvider } from '../src/context/session'
import { useRepository } from '../src/hooks'

describe('Session', () => {
  it('Should update the current user state on repository auth.state change', async () => {
    const MockElement: React.FC = () => {
      const repo = useRepository()
      repo.authentication.currentUser.setValue({
        Type: 'User',
        Id: 12345,
        Name: 'DevDog',
        Path: 'Root/IMS/DevDog',
      })
      return <div />
    }
    await act(async () => {
      mount(
        <SessionContextProvider>
          <MockElement />
        </SessionContextProvider>,
      )
    })
  })
})
