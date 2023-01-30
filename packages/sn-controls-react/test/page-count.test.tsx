import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, NumberField, PageCount } from '../src/fieldcontrols'

describe('Name field control', () => {
  const defaultSettings = {
    Name: 'PageCount',
    FieldClassName: 'SenseNet.ContentRepository.Fields.IntegerField',
    DisplayName: 'Page Count',
    Description:
      'Read-only field for storing the number of pages in the document. It is filled by the document preview generator.',
    Type: 'IntegerFieldSetting',
  }

  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = '1'
      const wrapper = shallow(<PageCount fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(value)
      expect(wrapper).toMatchSnapshot()
    })
    it('should convert negative numbers to its meaning in text', () => {
      const value = '-1'
      const wrapper = shallow(<PageCount fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.pageCount['-1'])
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<PageCount actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.pageCount.noValue)
    })
    it('should show fieldValue of 1 and UsePageCount Field', () => {
      const value = '1'
      const wrapper = shallow(<NumberField fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(value)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = '1'
      const wrapper = shallow(
        <PageCount
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
          }}
        />,
      )
      expect(wrapper.find(TextField).prop('value')).toBe(value)
      expect(wrapper.find(TextField).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('id')).toBe(defaultSettings.Name)
      expect(wrapper.find(TextField).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(TextField).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <PageCount
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: '1',
          }}
        />,
      )

      expect(wrapper.find(TextField).prop('value')).toEqual('1')
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(<PageCount actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      wrapper.find(TextField).simulate('change', { target: { value: '1' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
