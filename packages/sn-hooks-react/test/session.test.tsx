import React from 'react'
import { mount, shallow } from 'enzyme'
import { SessionContextProvider } from '../src/context/session'
import { useRepository } from '../src/hooks'

describe('Session', () => {
  it('matches snapshot', () => {
    const p = shallow(<SessionContextProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Should update the current user state on repository auth.state change', () => {
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

    const m = mount(
      <SessionContextProvider>
        <MockElement />
      </SessionContextProvider>,
    )

    m.unmount()
  })
})
