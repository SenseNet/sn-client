import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, NumberField } from '../src/fieldcontrols'

describe('Number field control', () => {
  const defaultSettings = {
    Name: 'Index',
    FieldClassName: 'SenseNet.ContentRepository.Fields.IntegerField',
    DisplayName: 'Index',
    Description: 'Content order in navigation. Numbers closer to 0 will appear first.',
    Type: 'IntegerFieldSetting',
  }
  const currencySettings = {
    Format: 'en-US',
    Name: 'ExpectedRevenue',
    FieldClassName: 'SenseNet.ContentRepository.Fields.CurrencyField',
    DisplayName: 'Expected revenue',
    Type: 'CurrencyFieldSetting',
  }

  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = '123'
      const wrapper = shallow(<NumberField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show fieldValue with currency when fieldValue is provided and is a currency field', () => {
      const value = '123'
      const wrapper = shallow(<NumberField fieldValue={value} actionName="browse" settings={currencySettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(`${currencySettings.Format}${value}`)
    })

    it('should show fieldValue with percentage when fieldValue is provided and ShowPercentage is true', () => {
      const value = '123'
      const wrapper = shallow(
        <NumberField
          fieldValue={value}
          actionName="browse"
          settings={{ ...defaultSettings, ShowAsPercentage: true }}
        />,
      )
      expect(wrapper.find(Typography).last().text()).toBe(`${value}%`)
    })

    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<NumberField actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.number.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <NumberField
          fieldValue={7 as any}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            Step: 1,
            ShowAsPercentage: true,
            MaxValue: 50,
            MinValue: 4,
            Format: 'en-US',
          }}
        />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe(7)
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe('0')
      expect(wrapper.find(TextField).prop('required')).toBeTruthy()
      expect(wrapper.find(TextField).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <NumberField
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: '7',
          }}
        />,
      )

      expect(wrapper.find(TextField).prop('value')).toEqual(7)
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(
        <NumberField actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      wrapper.find(TextField).simulate('change', { target: { value: '2' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
