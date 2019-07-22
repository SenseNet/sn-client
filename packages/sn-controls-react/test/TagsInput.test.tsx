import React from 'react'
import { mount, shallow } from 'enzyme'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Select from '@material-ui/core/Select'
import { sleepAsync } from '@sensenet/client-utils'
import Chip from '@material-ui/core/Chip'
import SvgIcon from '@material-ui/core/SvgIcon'
import { TagsInput } from '../src/fieldcontrols/TagsInput'

const userContent = {
  Name: 'Alba Monday',
  Path: 'Root/IMS/Public/alba',
  DisplayName: 'Alba Monday',
  Id: 4804,
  Type: 'User',
  BirthDate: new Date(2000, 5, 15).toISOString(),
  Avatar: { Url: '/Root/Sites/Default_Site/demoavatars/alba.jpg' },
  Enabled: true,
  Manager: {
    Name: 'Business Cat',
    Path: 'Root/IMS/Public/businesscat',
    DisplayName: 'Business Cat',
    Id: 4810,
    Type: 'User',
  },
}

const defaultSettings = {
  Type: 'ReferenceFieldSetting',
  AllowedTypes: ['User', 'Group'],
  SelectionRoots: ['/Root/IMS', '/Root'],
  Name: 'Members',
  FieldClassName: 'SenseNet.ContentRepository.Fields.ReferenceField',
  DisplayName: 'Members',
  Description: 'The members of this group.',
}

const repository: any = {
  loadCollection: jest.fn(() => {
    return { d: { results: [userContent] } }
  }),
  configuration: {
    repositoryUrl: 'url',
  },
}
describe('Tags input field control', () => {
  describe('in browse view', () => {
    it('should show all the content passed as fieldValue', () => {
      const wrapper = shallow(
        <TagsInput actionName="browse" settings={defaultSettings} fieldValue={[userContent] as any} />,
      )
      expect(wrapper.find(FormLabel).text()).toBe(defaultSettings.DisplayName)
      expect(
        wrapper
          .find(FormControlLabel)
          .last()
          .prop('label'),
      ).toBe(userContent.DisplayName)
      expect(wrapper).toMatchSnapshot()
    })

    it('should not show anything when field value is not provided', () => {
      const wrapper = shallow(<TagsInput actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })

  describe('in edit/new view', () => {
    it('should throw error when no repository is passed', () => {
      // Don't show console errors when tests runs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
      shallow(<TagsInput actionName="edit" settings={defaultSettings} />)
      expect(consoleSpy).toBeCalled()
      // Restore console.errors
      jest.restoreAllMocks()
    })

    it('should show an empty input field when no content is passed', async () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const wrapper = shallow(<TagsInput actionName="new" settings={defaultSettings} repository={repository} />)
      expect(consoleSpy).not.toBeCalled()
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()
      expect(updatedWrapper.find(Select).prop('value')).toHaveLength(0)
    })

    it('should show the value of the field when content is passed', async () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const wrapper = mount(
        <TagsInput actionName="edit" settings={defaultSettings} content={userContent} repository={repository} />,
      )
      expect(consoleSpy).not.toBeCalled()
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()
      expect(updatedWrapper.find(Select).prop('value')).toHaveLength(1)
    })

    it('should remove a tag when X is clicked', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <TagsInput
          actionName="edit"
          settings={defaultSettings}
          content={userContent}
          fieldOnChange={fieldOnChange}
          repository={repository}
        />,
      )
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()
      updatedWrapper
        .find(Chip)
        .find(SvgIcon)
        .simulate('click')
      expect(updatedWrapper.find(Select).prop('value')).toHaveLength(0)
      expect(fieldOnChange).toBeCalled()
    })

    it('should handle selection change', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <TagsInput actionName="new" settings={defaultSettings} fieldOnChange={fieldOnChange} repository={repository} />,
      )
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()
      const onChange = updatedWrapper.find(Select).prop('onChange')
      onChange && onChange({ target: { value: 4804 } } as any, {})
      expect(fieldOnChange).toBeCalled()
    })
  })
})
