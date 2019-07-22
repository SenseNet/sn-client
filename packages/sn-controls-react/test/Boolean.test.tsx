import React from 'react'
import { mount, shallow } from 'enzyme'
import Icon from '@material-ui/core/Icon'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import { act } from 'react-dom/test-utils'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { BooleanComponent } from '../src/fieldcontrols/Boolean'

describe('Boolean field control', () => {
  const defaultSettings = {
    Type: 'NullFieldSetting',
    Name: 'Enabled',
    FieldClassName: 'SenseNet.ContentRepository.Fields.BooleanField',
    DisplayName: 'Enabled',
    Description: 'User account is enabled.',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(
        <BooleanComponent fieldValue={true as any} actionName="browse" settings={defaultSettings} />,
      )
      expect(wrapper.find('span').text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Icon).text()).toBe('check')
      expect(wrapper).toMatchSnapshot()
    })
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<BooleanComponent actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', () => {
      const wrapper = shallow(
        <BooleanComponent
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

    it('should call on change when input changes', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <BooleanComponent actionName="edit" fieldOnChange={fieldOnChange} settings={defaultSettings} />,
      )
      const onChange = wrapper
        .find(Checkbox)
        .first()
        .prop('onChange')
      act(() => {
        onChange && onChange({ target: { checked: true } } as any, true)
      })
      expect(fieldOnChange).toBeCalled()
    })
  })
})
