import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Textarea } from '../src/fieldcontrols/Textarea'

describe('Textarea field control', () => {
  const defaultSettings = {
    Name: 'Description',
    Type: 'LongTextFieldSetting',
    DisplayName: 'Description of the field',
    FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = 'Hello World'
      const wrapper = shallow(<Textarea fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(
        wrapper
          .find(Typography)
          .first()
          .text(),
      ).toBe(defaultSettings.DisplayName)
      expect(
        wrapper
          .find(Typography)
          .last()
          .text(),
      ).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<Textarea actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = 'Hello World'
      const wrapper = shallow(
        <Textarea
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            DefaultValue: 'defaultValue',
            Description: 'description',
          }}
        />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe(value)
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('required')).toBeTruthy()
      expect(wrapper.find(TextField).prop('disabled')).toBeTruthy()
      expect(wrapper.find(TextField).prop('multiline')).toBeTruthy()
      expect(wrapper.find(TextField).prop('helperText')).toBe('description')
      expect(wrapper).toMatchSnapshot()
    })
    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<Textarea actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: 'Hello World' } })
      expect(fieldOnChange).toBeCalled()
    })
    it('should remove html tags from the field value', () => {
      const wrapper = shallow(
        <Textarea actionName="edit" fieldValue="<html>some value</html>" settings={defaultSettings} />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe('some value')
    })
  })
})
