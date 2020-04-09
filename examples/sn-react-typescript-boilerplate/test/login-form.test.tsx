import { shallow } from 'enzyme'
import React from 'react'
import { TextField } from '@material-ui/core'
import { LoginForm } from '../src/components/login-form'

describe('Login Form', () => {
  it('Matches snapshot with error', () => {
    const l = shallow(<LoginForm onLogin={() => {}} error=":(" />)
    expect(l).toMatchSnapshot()
  })

  it('executes onLogin after login', () => {
    const onLogin = jest.fn()
    const l = shallow(<LoginForm onLogin={onLogin} />)
    l.findWhere((e) => e.type() === TextField).map((e) =>
      e.prop('onChange')({
        preventDefault: () => undefined,
        target: { value: 'aaa' },
      }),
    )
    l.find('form').simulate('submit', { preventDefault: () => undefined })
    expect(onLogin).toBeCalled()
  })
})
