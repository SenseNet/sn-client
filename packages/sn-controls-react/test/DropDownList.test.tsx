import React from 'react'
import { shallow } from 'enzyme'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { DropDownList } from '../src/fieldcontrols/DropDownList'

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

describe('Drop down list field control', () => {
  describe('in browse view', () => {
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<DropDownList actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })

    it('should show all the selected fields when an array of fieldValue is passed', () => {
      const wrapper = shallow(
        <DropDownList actionName="browse" settings={defaultSettings} fieldValue={['0', '2'] as any} />,
      )
      expect(wrapper.find(FormControlLabel)).toHaveLength(2)
      expect(
        wrapper
          .find(FormControlLabel)
          .first()
          .prop('label'),
      ).toBe(defaultSettings.Options[0].Text)
      expect(
        wrapper
          .find(FormControlLabel)
          .last()
          .prop('label'),
      ).toBe(defaultSettings.Options[2].Text)
    })

    it('should show fieldValue it is passed as a string', () => {
      const wrapper = shallow(<DropDownList actionName="browse" settings={defaultSettings} fieldValue="0" />)
      expect(wrapper.find(FormControlLabel)).toHaveLength(1)
      expect(wrapper.find(FormControlLabel).prop('label')).toBe(defaultSettings.Options[0].Text)
    })
  })

  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <DropDownList
          fieldValue="0"
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            DefaultValue: '0',
          }}
        />,
      )

      expect(wrapper.find(Select).prop('value')).toEqual('0')
      expect(wrapper.find(Select).prop('name')).toBe(defaultSettings.Name)
      expect(wrapper.find(Select).prop('defaultValue')).toBe('0')
      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('required')).toBeTruthy()
      expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(MenuItem)).toHaveLength(4)
      expect(wrapper).toMatchSnapshot()
    })
    it('should call on change when radio button is selected', () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(
        <DropDownList actionName="edit" fieldValue="1" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      wrapper.find(Select).simulate('change', { target: { value: '2' } })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
