import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import { TimePicker as MUITimePicker } from '@material-ui/pickers'
import { TimePicker } from '../src/fieldcontrols/TimePicker'

const value = '2001-09-11T08:46:00.000Z'
const defaultSettings = {
  Name: 'ModificationDate',
  Type: 'DateTimeFieldSetting',
  DisplayName: 'Modification Date',
  FieldClassName: 'SenseNet.ContentRepository.Fields.DateTimeField',
}

describe('Time picker field control', () => {
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<TimePicker fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(moment(value).format('HH:mm:ss'))
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<TimePicker actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <TimePicker
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
      expect(wrapper.find(MUITimePicker).prop('value')).toBe(value)
      expect(wrapper.find(MUITimePicker).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(MUITimePicker).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUITimePicker).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUITimePicker).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(MUITimePicker).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(MUITimePicker).prop('required')).toBeTruthy()
      expect(wrapper.find(MUITimePicker).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })
    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<TimePicker actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find('PickerWithState').simulate('change', new Date(123234538324).toISOString())
      expect(fieldOnChange).toBeCalled()
    })
  })
})
