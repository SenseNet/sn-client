import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { CheckboxGroup, defaultLocalization } from '../src/fieldcontrols'

const defaultSettings = {
  Name: 'VersioningMode',
  Type: 'ChoiceFieldSetting',
  DisplayName: 'Versioning Mode For Current Content',
  Description: 'It shows the versioning mode of the current content.',
  FieldClassName: 'SenseNet.ContentRepository.Fields.VersioningModeField',
  Options: [
    { Value: '0', Text: 'Inherited', Enabled: true, Selected: true },
    { Value: '1', Text: 'None', Enabled: true, Selected: false },
    { Value: '2', Text: 'Major only', Enabled: true, Selected: false },
    { Value: '3', Text: 'Major and minor', Enabled: true, Selected: false },
  ],
}

describe('Check box group field control', () => {
  describe('in browse view', () => {
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<CheckboxGroup actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.checkboxGroup.noValue)
    })

    it('should show all the selected fields when an array of fieldValue is passed', () => {
      const wrapper = shallow(
        <CheckboxGroup actionName="browse" settings={defaultSettings} fieldValue={['0', '2'] as any} />,
      )
      expect(wrapper.find(FormGroup).find(Typography)).toHaveLength(2)
      expect(wrapper.find(FormGroup).find(Typography).first().props().children).toBe(defaultSettings.Options[0].Text)
      expect(wrapper.find(FormGroup).find(Typography).last().props().children).toBe(defaultSettings.Options[2].Text)
    })

    it('should show fieldValue when it is passed as a string', () => {
      const wrapper = shallow(<CheckboxGroup actionName="browse" settings={defaultSettings} fieldValue="0" />)
      expect(wrapper.find(FormGroup).find(Typography)).toHaveLength(1)
      expect(wrapper.find(FormGroup).find(Typography).props().children).toBe(defaultSettings.Options[0].Text)
    })
  })

  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = mount(
        <CheckboxGroup
          fieldValue="0"
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: false,
          }}
        />,
      )

      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('required')).toBeFalsy()
      expect(wrapper.find(FormLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(Checkbox)).toHaveLength(4)
    })

    it('should set default value', () => {
      const wrapper = shallow(
        <CheckboxGroup
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: '1',
          }}
        />,
      )
      wrapper.find(Checkbox).forEach((checkbox, index) => {
        expect(checkbox.props().checked).toBe(index === 1 ? true : false)
      })
    })

    it('should call on change when a checkbox is selected', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <CheckboxGroup actionName="edit" fieldValue="1" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      const onChange = wrapper.find(Checkbox).first().prop('onChange')
      act(() => {
        onChange?.({ target: { checked: true } } as any, true)
      })
      expect(fieldOnChange).toBeCalledWith('VersioningMode', ['0'])
    })
  })
})
