import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { mount, shallow } from 'enzyme'
import { FileName } from '../src/fieldcontrols/FileName'

const defaultSettings = {
  Name: 'DisplayName',
  Type: 'ShortTextFieldSetting',
  DisplayName: 'Display name',
  FieldClassName: 'SenseNet.ContentRepository.Fields.ShortTextField',
}

describe('File name field control', () => {
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = 'approving_enabled.png'
      const wrapper = shallow(<FileName fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<FileName actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = 'approving_enabled.png'
      const wrapper = shallow(
        <FileName
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
      expect(wrapper.find(TextField).prop('value')).toBe('approving_enabled')
      expect(wrapper.find(TextField).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('required')).toBeTruthy()
      expect(wrapper.find(TextField).prop('disabled')).toBeTruthy()
      expect(wrapper.find(TextField).prop('helperText')).toBe('description')
      expect(wrapper).toMatchSnapshot()
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<FileName actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: 'Hello World' } })
      expect(fieldOnChange).toBeCalled()
    })
    it('should show the extension when provided', () => {
      const wrapper = mount(<FileName actionName="edit" extension="jpg" settings={defaultSettings} />)
      expect(wrapper.find('span').text()).toBe('.jpg')
    })
  })
})
