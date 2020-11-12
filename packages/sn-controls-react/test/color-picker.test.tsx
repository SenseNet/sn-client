import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { SketchPicker } from 'react-color'
import { ColorPicker, defaultLocalization } from '../src/fieldcontrols'

describe('Color field control', () => {
  const defaultSettings = {
    Name: 'Color',
    FieldClassName: 'SenseNet.ContentRepository.Fields.ColorField',
    DisplayName: 'Color',
    Description: 'Color',
    Type: 'ColorFieldSetting',
  }
  const value = '#016d9e'
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<ColorPicker fieldValue={value} actionName="browse" settings={defaultSettings} />)
      const labelElement = wrapper.find(Typography).first()
      const valueElement = wrapper.find(Typography).at(1)
      expect(labelElement.props().children).toEqual(defaultSettings.DisplayName)
      expect(valueElement.props().children).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<ColorPicker actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.colorPicker.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <ColorPicker
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
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
      expect(wrapper.find(TextField).prop('helperText')).toBe(defaultSettings.Description)
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <ColorPicker
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
          }}
        />,
      )

      expect(wrapper.find(TextField).prop('value')).toBe('defaultValue')
    })
    it('should open color picker when input is clicked', () => {
      const wrapper = shallow(<ColorPicker actionName="edit" settings={defaultSettings} />)
      wrapper.find(TextField).simulate('click')
      expect(wrapper.exists(SketchPicker)).toBeTruthy()
    })
    it('should handle color change', () => {
      const fieldChange = jest.fn()
      const wrapper = shallow(<ColorPicker actionName="edit" fieldOnChange={fieldChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('click')
      const onChange: any | undefined = wrapper.find(SketchPicker).prop('onChangeComplete')
      onChange?.({ hex: '#111111' })
      expect(fieldChange).toBeCalled()
    })
  })
})
