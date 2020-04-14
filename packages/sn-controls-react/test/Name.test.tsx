import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Name } from '../src/fieldcontrols/Name'

describe('Name field control', () => {
  const defaultSettings = {
    Name: 'Name',
    FieldClassName: 'SenseNet.ContentRepository.Fields.ShortTextField',
    DisplayName: 'Name',
    Description: 'Specify a name that will appear in the address bar of the browser.',
    Type: 'ShortTextFieldSetting',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = 'Hello World'
      const wrapper = shallow(<Name fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<Name actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = 'Hello World'
      const wrapper = shallow(
        <Name
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            DefaultValue: 'defaultValue',
          }}
        />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe(value)
      expect(wrapper.find(TextField).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('required')).toBeTruthy()
      expect(wrapper.find(TextField).prop('disabled')).toBeTruthy()
      expect(wrapper.find(TextField).prop('helperText')).toBe(defaultSettings.Description)
      expect(wrapper).toMatchSnapshot()
    })
    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<Name actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: 'Hello World' } })
      expect(fieldOnChange).toBeCalled()
    })
    it('should show error message when invalid character is typed', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<Name actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: 'Hello World%' } })
      expect(fieldOnChange).not.toBeCalled()
      expect(wrapper.find(TextField).prop('helperText')).not.toBe(defaultSettings.Description)
      expect(wrapper.find(TextField).prop('error')).toBeTruthy()
    })
  })
})
