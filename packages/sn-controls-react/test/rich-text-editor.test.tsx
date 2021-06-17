import { Editor } from '@sensenet/editor-react'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, RichTextEditor } from '../src/fieldcontrols'

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
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<RichTextEditor actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.richTextEditor.noValue)
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
            Description: 'description',
          }}
        />,
      )

      expect(wrapper.find(Editor).prop('content')).toBe(value)
      expect(wrapper.find(Editor).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Editor).prop('readOnly')).toBeTruthy()
      expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(InputLabel).prop('required')).toBeTruthy()
      expect(wrapper.find(FormHelperText).text()).toBe('description')
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <RichTextEditor
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
          }}
        />,
      )
      expect(wrapper.find(Editor).prop('content')).toBe('defaultValue')
    })
  })
})
