import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization, Switch, Switcher } from '../src/fieldcontrols'

describe('Switcher field control', () => {
  const defaultSettings = {
    Type: 'NullFieldSetting',
    Name: 'Enabled',
    FieldClassName: 'SenseNet.ContentRepository.Fields.BooleanField',
    DisplayName: 'Enabled',
    Description: 'User account is enabled.',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(<Switcher fieldValue={true as any} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Grid).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Switch).prop('checked')).toBe(true)
      expect(wrapper).toMatchSnapshot()
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<Switcher actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Grid).last().text()).toBe(defaultLocalization.switcher.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <Switcher
          fieldValue={true as any}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
          }}
        />,
      )
      expect(wrapper.find(Grid).at(1).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(FormHelperText).text()).toBe(defaultSettings.Description)
      expect(wrapper.find(FormControl).prop('required')).toBeTruthy()
      expect(wrapper.find(FormControl).prop('disabled')).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    })

    it('should set default value', () => {
      const wrapper = mount(
        <Switcher
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'true',
          }}
        />,
      )

      expect(wrapper.find(Switch).props().checked).toBe(true)
    })

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(<Switcher actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />)
      const onChange = wrapper.find(Switch).prop('onChange')
      act(() => {
        onChange?.({ target: { checked: true } } as any, true)
      })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
