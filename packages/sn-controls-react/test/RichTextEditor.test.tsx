import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import ReactQuill from 'react-quill'
import { RichTextEditor } from '../src/fieldcontrols'

describe('Rich text editor field control', () => {
  const defaultSettings = {
    Name: 'Description',
    Type: 'LongTextFieldSetting',
    DisplayName: 'Description of the field',
    FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = '<h1>Hello World</h1>'
      const wrapper = shallow(<RichTextEditor fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find('div').last().html()).toBe(`<div>${value}</div>`)
      expect(wrapper).toMatchSnapshot()
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<RichTextEditor actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const value = 'Hello World'
      const wrapper = shallow(
        <RichTextEditor
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

      expect(wrapper.find(ReactQuill).prop('value')).toBe(value)
      expect(wrapper.find(ReactQuill).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(ReactQuill).prop('defaultValue')).toBe('defaultValue')
      expect(wrapper.find(ReactQuill).prop('readOnly')).toBeTruthy()
      expect(wrapper.find(FormLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormControl).prop('required')).toBeTruthy()
      expect(wrapper.find(FormHelperText).text()).toBe('description')
      expect(wrapper).toMatchSnapshot()
    })
    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(
        <RichTextEditor actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      wrapper.find(ReactQuill).simulate('change', { target: { value: 'Hello World' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
