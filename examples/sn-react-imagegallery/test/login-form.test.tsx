import { mount, shallow } from 'enzyme'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { act } from 'react-dom/test-utils'
import { LoginForm } from '../src/components/login-form'

describe('LoginForm', () => {
  const testprop = {
    onLogin: jest.fn(),
    error: 'test',
  }
  it('matches LoginForm snapshot', () => {
    const wrapper = shallow(<LoginForm {...testprop} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('changes the username', async () => {
    const wrapper = mount(<LoginForm {...testprop} />)
    act(() => {
      ;(wrapper.find(TextField).first().prop('onChange') as any)({ target: { value: 'testusername' } } as any)
    })
    expect(wrapper.update().find(TextField).first().props().value).toEqual('testusername')
  })
  it('changes the repository', async () => {
    const wrapper = mount(<LoginForm {...testprop} />)
    act(() => {
      ;(wrapper.find(TextField).at(2).prop('onChange') as any)({
        target: { value: 'https://dev.demo.sensenet.com' },
      } as any)
    })
    expect(wrapper.update().find(TextField).at(2).props().value).toEqual('https://dev.demo.sensenet.com')
  })
})
