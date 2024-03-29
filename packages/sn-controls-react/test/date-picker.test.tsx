import Typography from '@material-ui/core/Typography'
import { DateTimePicker, DatePicker as MUIDatePicker } from '@material-ui/pickers'
import { DateTimeFieldSetting, DateTimeMode } from '@sensenet/default-content-types'
import { intlFormatDistance } from 'date-fns'
import { shallow } from 'enzyme'
import React from 'react'
import { DatePicker, dateTimeOptions, defaultLocalization } from '../src/fieldcontrols'

const defaultSettings: DateTimeFieldSetting = {
  DateTimeMode: DateTimeMode.DateAndTime,
  Name: 'ModificationDate',
  FieldClassName: 'SenseNet.ContentRepository.Fields.DateTimeField',
  DisplayName: 'Modification Date',
  Description: 'Content was last modified on this date.',
  Type: 'DateTimeFieldSetting',
}

const locale: Locale = {
  code: 'en-US',
}

const value = '1912-04-15T02:10:00.000Z'

describe('Date/Date time field control', () => {
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(
        <DatePicker locale={locale} fieldValue={value} actionName="browse" settings={defaultSettings} />,
      )
      expect(wrapper.find(Typography).first().text()).toBe(
        `${defaultSettings.DisplayName}${intlFormatDistance(new Date(value), new Date(), { locale: locale?.code })}`,
      )
      expect(wrapper.find(Typography).last().text()).toBe(
        new Intl.DateTimeFormat(locale.code, dateTimeOptions).format(new Date(value)),
      )
    })

    it('should show the displayname and fieldValue as date when fieldValue is provided and set as date', () => {
      const wrapper = shallow(
        <DatePicker
          fieldValue={value}
          actionName="browse"
          locale={locale}
          settings={{ ...defaultSettings, DateTimeMode: DateTimeMode.Date }}
        />,
      )
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(new Intl.DateTimeFormat('en-Us').format(new Date(value)))
      expect(wrapper).toMatchSnapshot()
    })

    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<DatePicker actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.datePicker.noValue)
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
          }}
        />,
      )
      expect(wrapper.find(DateTimePicker).prop('value')).toBe(value)
      expect(wrapper.find(DateTimePicker).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(DateTimePicker).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(DateTimePicker).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(DateTimePicker).prop('required')).toBeTruthy()
      expect(wrapper.find(DateTimePicker).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <DatePicker
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
          }}
        />,
      )

      expect(wrapper.find(DateTimePicker).prop('value')).toBe('defaultValue')
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
            DateTimeMode: DateTimeMode.Date,
          }}
        />,
      )

      expect(wrapper.find(MUIDatePicker).prop('value')).toBe(value)
      expect(wrapper.find(MUIDatePicker).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUIDatePicker).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(MUIDatePicker).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(MUIDatePicker).prop('required')).toBeTruthy()
      expect(wrapper.find(MUIDatePicker).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value for date', () => {
      const wrapper = shallow(
        <DatePicker
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
            DateTimeMode: DateTimeMode.Date,
          }}
        />,
      )

      expect(wrapper.find(MUIDatePicker).prop('value')).toBe('defaultValue')
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<DatePicker actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(DateTimePicker).simulate('change', new Date(123234538324).toISOString())
      expect(fieldOnChange).toBeCalled()
    })

    it('value should be null when value is .Net min.Date', () => {
      const wrapper = shallow(
        <DatePicker
          actionName="edit"
          fieldValue="0001-01-01T00:00:00Z"
          settings={{
            ...defaultSettings,
            DateTimeMode: DateTimeMode.Date,
          }}
        />,
      )

      expect(wrapper.find(MUIDatePicker).prop('value')).toBe(null)
    })
  })
})
