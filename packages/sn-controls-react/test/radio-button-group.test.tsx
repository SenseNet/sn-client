import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import { defaultLocalization, RadioButtonGroup } from '../src/fieldcontrols'

describe('Radio button group field control', () => {
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
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<RadioButtonGroup actionName="browse" fieldValue="2" settings={defaultSettings} />)
      const labelElement = wrapper.find(Typography).first()
      const valueElement = wrapper.find(Typography).at(1)
      expect(labelElement.props().children).toEqual(defaultSettings.DisplayName)
      expect(valueElement.props().children).toEqual(defaultSettings.Options[2].Text)
    })
    it('should show the fieldValue when fieldValue is provided and no options found', () => {
      const wrapper = shallow(
        <RadioButtonGroup actionName="browse" fieldValue="2" settings={{ ...defaultSettings, Options: undefined }} />,
      )
      const labelElement = wrapper.find(Typography).first()
      const valueElement = wrapper.find(Typography).at(1)
      expect(labelElement.props().children).toEqual(defaultSettings.DisplayName)
      expect(valueElement.props().children).toEqual('2')
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<RadioButtonGroup actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.radioButtonGroup.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <RadioButtonGroup
          fieldValue={['1'] as any}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            DefaultValue: '0',
          }}
        />,
      )

      expect(wrapper.find(RadioGroup).prop('value')).toBe('1')
      expect(wrapper.find(RadioGroup).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('required')).toBeTruthy()
      expect(wrapper.find(FormLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(FormControlLabel).length).toBe(4)
    })
    it('should call on change when radio button is selected', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(
        <RadioButtonGroup actionName="edit" fieldValue="1" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      wrapper.find(RadioGroup).simulate('change', { target: { value: '2' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
