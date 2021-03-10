import { toNumber } from '@sensenet/client-utils'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, FileSizeField } from '../src/fieldcontrols'

const round = (num: number, precision = 1) => {
  const multiplier = Math.pow(10, precision)
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier
}

describe('FileSize field control', () => {
  const defaultSettings = {
    Name: 'Size',
    FieldClassName: 'SenseNet.ContentRepository.Fields.NumberField',
    DisplayName: 'Size',
    Description: 'File size',
    Type: 'NumberFieldSetting',
  }

  describe('in browse view', () => {
    it('should show the displayname and fieldValue with byte unit when fieldValue is provided and less than 1024', () => {
      const value = '123'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(`${value} byte`)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show the displayname and fieldValue with KB unit when fieldValue is provided and between 1024 and 1 048 576 {pow(1024,2)}', () => {
      const value = '1500'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(`${round(toNumber(value) / 1024)} KB`)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show the displayname and fieldValue with MB unit when fieldValue is provided and between 1 048 576 and 1 073 741 824 {pow(1024,3)}', () => {
      const value = '1050000'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(`${round(toNumber(value) / 1024 / 1024)} MB`)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show the displayname and fieldValue with GB unit when fieldValue is provided and between 1 073 741 824 and 1 099 511 627 776 {pow(1024,4)}', () => {
      const value = '2147483648'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(`${round(toNumber(value) / 1024 / 1024 / 1024)} GB`)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show the displayname and fieldValue with TB unit when fieldValue is provided and between 1 099 511 627 776 and 1 125 899 906 842 624 {pow(1024,5)}', () => {
      const value = '718552496548997'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(`${round(toNumber(value) / 1024 / 1024 / 1024 / 1024)} TB`)
      expect(wrapper).toMatchSnapshot()
    })

    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<FileSizeField actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.fileSize.noValue)
    })

    it('should show no value message when field value is undefined', () => {
      const value = undefined
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.fileSize.noValue)
    })

    it('should show no value message when field value is null', () => {
      const value = null
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.fileSize.noValue)
    })

    it('should show no value message when field value is 0', () => {
      const value = '0'
      const wrapper = shallow(<FileSizeField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.fileSize.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <FileSizeField
          fieldValue={7 as any}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            Step: 1,
            MaxValue: 50,
            MinValue: 4,
          }}
        />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe(7)
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('required')).toBeTruthy()
      expect(wrapper.find(TextField).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <FileSizeField
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
        <FileSizeField actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      wrapper.find(TextField).simulate('change', { target: { value: 2 } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
