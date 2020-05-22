import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { CheckboxGroup } from '../src/fieldcontrols/CheckboxGroup'

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
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<CheckboxGroup actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })

    it('should show all the selected fields when an array of fieldValue is passed', () => {
      const wrapper = shallow(
        <CheckboxGroup actionName="browse" settings={defaultSettings} fieldValue={['0', '2'] as any} />,
      )
      expect(wrapper.find(FormControlLabel)).toHaveLength(2)
      expect(wrapper.find(FormControlLabel).first().prop('label')).toBe(defaultSettings.Options[0].Text)
      expect(wrapper.find(FormControlLabel).last().prop('label')).toBe(defaultSettings.Options[2].Text)
    })

    it('should show fieldValue when it is passed as a string', () => {
      const wrapper = shallow(<CheckboxGroup actionName="browse" settings={defaultSettings} fieldValue="0" />)
      expect(wrapper.find(FormControlLabel)).toHaveLength(1)
      expect(wrapper.find(FormControlLabel).prop('label')).toBe(defaultSettings.Options[0].Text)
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
            DefaultValue: '0',
          }}
        />,
      )

      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('required')).toBeFalsy()
      expect(wrapper.find(FormLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(Checkbox)).toHaveLength(4)
    })

    it('should call on change when a checkbox is selected', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <CheckboxGroup actionName="edit" fieldValue="1" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      const onChange = wrapper.find(Checkbox).first().prop('onChange')
      act(() => {
        onChange && onChange({ target: { checked: true } } as any, true)
      })
      expect(fieldOnChange).toBeCalledWith('VersioningMode', [
        { Enabled: true, Selected: true, Text: 'Inherited', Value: '0' },
      ])
    })
  })
})
