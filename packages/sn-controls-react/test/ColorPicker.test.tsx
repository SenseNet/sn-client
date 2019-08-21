import React from 'react'
import { shallow } from 'enzyme'
import TextField from '@material-ui/core/TextField'
import { SketchPicker } from 'react-color'
import { ColorPicker } from '../src/fieldcontrols/ColorPicker'

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
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('value')).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<ColorPicker actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
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
    it('should open color picker when input is clicked', () => {
      const wrapper = shallow(<ColorPicker actionName="edit" settings={defaultSettings} />)
      wrapper.find(TextField).simulate('click')
      expect(wrapper.exists(SketchPicker)).toBeTruthy()
    })
    it('should handle color change', () => {
      const fieldChange = jest.fn()
      const wrapper = shallow(<ColorPicker actionName="edit" fieldOnChange={fieldChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('click')
      const onChange = wrapper.find(SketchPicker).prop('onChangeComplete')
      onChange && onChange({ hex: '#111111' } as any)
      expect(fieldChange).toBeCalled()
    })
  })
})
