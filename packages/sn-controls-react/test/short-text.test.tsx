import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, ShortText } from '../src/fieldcontrols'

describe('Short text field control', () => {
  const defaultSettings = {
    Name: 'DisplayName',
    Type: 'ShortTextFieldSetting',
    DisplayName: 'Display name',
    FieldClassName: 'SenseNet.ContentRepository.Fields.ShortTextField',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = 'Hello World'
      const wrapper = shallow(<ShortText fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<ShortText actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.shortText.noValue)
    })
    it('should show [OBJECT] when iccorect value type passed', () => {
      const value = { url: '' }
      const wrapper = shallow(<ShortText fieldValue={value as any} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe('[OBJECT]')
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = 'Hello World'
      const wrapper = shallow(
        <ShortText
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            MinLength: 2,
            MaxLength: 12,
            Description: 'description',
            Regex: '(^\\d*([-\\s\\+\\(\\)]\\d*)*$)?',
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
      expect(wrapper.find(FormHelperText).text()).toEqual('description')
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <ShortText
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
          }}
        />,
      )

      expect(wrapper.find(TextField).prop('value')).toEqual('defaultValue')
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<ShortText actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: 'Hello World' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
