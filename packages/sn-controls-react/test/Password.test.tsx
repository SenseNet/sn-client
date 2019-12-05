import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import { Password } from '../src/fieldcontrols/Password'

describe('Password field control', () => {
  const defaultSettings = {
    Type: 'PasswordFieldSetting',
    Name: 'Password',
    FieldClassName: 'SenseNet.ContentRepository.Fields.PasswordField',
    DisplayName: 'Password',
    Description: 'User password.',
  }

  it('should render the display name of the control in browse mode', () => {
    const wrapper = shallow(<Password actionName="browse" settings={defaultSettings} />)
    expect(wrapper.find(Typography).text()).toBe(defaultSettings.DisplayName)
  })

  it('should set all the props', () => {
    const wrapper = shallow(
      <Password
        actionName="edit"
        settings={{
          ...defaultSettings,
          ReadOnly: true,
          Compulsory: true,
        }}
      />,
    )
    expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
    expect(wrapper.find(Input).prop('name')).toBe(defaultSettings.Name)
    expect(wrapper.find(Input).prop('id')).toBe(defaultSettings.Name)
    expect(wrapper.find(Input).prop('placeholder')).toBe(defaultSettings.DisplayName)
    expect(wrapper.find(Input).prop('required')).toBeTruthy()
    expect(wrapper.find(Input).prop('disabled')).toBeTruthy()
    expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
    expect(wrapper).toMatchSnapshot()
  })

  it('should be able to show the password as text', () => {
    const wrapper = mount(<Password actionName="new" settings={defaultSettings} />)
    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(Input).prop('type')).toBe('text')
  })

  it('should call on change when input changes', () => {
    const fieldOnChange = jest.fn()
    const wrapper = shallow(<Password actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
    wrapper.find(TextField).simulate('change', { target: { value: 'Hello World' } })
    expect(fieldOnChange).toBeCalled()
  })
})
