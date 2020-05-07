import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { DateTimePicker, DatePicker as MUIDatePicker } from '@material-ui/pickers'
import { DateTimeMode } from '@sensenet/default-content-types'
import moment from 'moment'
import { DatePicker } from '../src/fieldcontrols/DatePicker'

const defaultSettings = {
  DateTimeMode: 2,
  Name: 'ModificationDate',
  FieldClassName: 'SenseNet.ContentRepository.Fields.DateTimeField',
  DisplayName: 'Modification Date',
  Description: 'Content was last modified on this date.',
  Type: 'DateTimeFieldSetting',
}

const value = '1912-04-15T02:10:00.000Z'

describe('Date/Date time field control', () => {
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<DatePicker fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(moment(value).toLocaleString())
    })

    it('should show the displayname and fieldValue as date when fieldValue is provided and set as date', () => {
      const wrapper = shallow(
        <DatePicker
          fieldValue={value}
          actionName="browse"
          settings={{ ...defaultSettings, DateTimeMode: DateTimeMode.Date }}
        />,
      )
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(moment(value).format('LL').toLocaleString())
      expect(wrapper).toMatchSnapshot()
    })

    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<DatePicker actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <DatePicker
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
      expect(wrapper.find(DateTimePicker).prop('value')).toBe(value)
      expect(wrapper.find(DateTimePicker).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(DateTimePicker).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(DateTimePicker).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(DateTimePicker).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(DateTimePicker).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(DateTimePicker).prop('required')).toBeTruthy()
      expect(wrapper.find(DateTimePicker).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should set all the props for date', () => {
      const wrapper = shallow(
        <DatePicker
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            DefaultValue: 'defaultValue',
            DateTimeMode: DateTimeMode.Date,
          }}
        />,
      )
      expect(wrapper.find(MUIDatePicker).prop('value')).toBe(value)
      expect(wrapper.find(MUIDatePicker).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(MUIDatePicker).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUIDatePicker).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUIDatePicker).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(MUIDatePicker).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(MUIDatePicker).prop('required')).toBeTruthy()
      expect(wrapper.find(MUIDatePicker).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<DatePicker actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(DateTimePicker).simulate('change', new Date(123234538324).toISOString())
      expect(fieldOnChange).toBeCalled()
    })
  })
})
