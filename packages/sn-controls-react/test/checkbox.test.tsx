import MuiCheckbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Icon from '@material-ui/core/Icon'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Checkbox, defaultLocalization } from '../src/fieldcontrols'

describe('Checkbox field control', () => {
  const defaultSettings = {
    Type: 'NullFieldSetting',
    Name: 'Enabled',
    FieldClassName: 'SenseNet.ContentRepository.Fields.BooleanField',
    DisplayName: 'Enabled',
    Description: 'User account is enabled.',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<Checkbox fieldValue={true as any} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find('span').text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Icon).text()).toBe('check')
      expect(wrapper).toMatchSnapshot()
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<Checkbox actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find('div').text()).toContain(defaultLocalization.checkbox.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <Checkbox
          fieldValue={true as any}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
          }}
        />,
      )
      expect(wrapper.find(FormControlLabel).prop('label')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(FormControl).prop('required')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = mount(
        <Checkbox
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'true',
          }}
        />,
      )

      expect(wrapper.find(MuiCheckbox).props().checked).toBe(true)
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(<Checkbox actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      const onChange = wrapper.find(MuiCheckbox).first().prop('onChange')
      act(() => {
        onChange?.({ target: { checked: true } } as any, true)
      })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
