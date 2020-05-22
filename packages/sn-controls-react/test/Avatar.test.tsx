import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Avatar } from '../src/fieldcontrols/Avatar/Avatar'
import { DefaultAvatarTemplate } from '../src/fieldcontrols/Avatar/DefaultAvatarTemplate'
import { AvatarPicker } from '../src/fieldcontrols/Avatar/AvatarPicker'

const defaultSettings = {
  Type: 'ReferenceFieldSetting',
  AllowedTypes: ['User', 'Group'],
  SelectionRoots: ['/Root/IMS', '/Root'],
  Name: 'Members',
  FieldClassName: 'SenseNet.ContentRepository.Fields.ReferenceField',
  DisplayName: 'Members',
  Description: 'The members of this group.',
}

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

const repository: any = {
  loadCollection: jest.fn(() => {
    return { d: { results: [userContent, { Id: 2123, Name: 'Jon Doe', Type: 'User', Path: '/' }] } }
  }),
  configuration: {
    repositoryUrl: 'url',
  },
}

describe('Avatar field control', () => {
  describe('in browse view', () => {
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<Avatar actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
    it('should render the default item template when there is a field value', () => {
      const wrapper = shallow(
        <Avatar actionName="browse" settings={defaultSettings} fieldValue={userContent.Avatar as any} />,
      )

      expect(wrapper.find(DefaultAvatarTemplate)).toHaveLength(1)
      expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
    })
  })
  describe('in edit/new view', () => {
    it('should open dialog when empty content is clicked', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = mount(<Avatar actionName="new" settings={defaultSettings} />)
      })
      const changeButton = wrapper.find(IconButton).first()
      expect(changeButton.prop('title')).toBe('Add avatar')
      await act(async () => {
        changeButton.simulate('click')
      })
      expect(wrapper.update().find(Dialog).prop('open')).toBeTruthy()
    })
    it('should remove the avatar when remove avatar is clicked', () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <Avatar
          actionName="edit"
          fieldOnChange={fieldOnChange}
          fieldValue={userContent.Avatar as any}
          settings={defaultSettings}
        />,
      )
      const removeButton = wrapper.find(IconButton).last()
      expect(removeButton.prop('title')).toBe('Remove avatar')
      removeButton.simulate('click')
      expect(fieldOnChange).toBeCalled()
      expect(wrapper.update().find(IconButton).prop('title')).toBe('Add avatar')
    })

    it('should handle avatar change', async () => {
      const fieldOnChange = jest.fn()
      const selectedContent = {
        Path: '/',
        Name: 'Jane Doe',
        Id: 1234,
        Type: 'User',
        Avatar: { Url: 'asd' },
      }
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <Avatar
            actionName="edit"
            fieldOnChange={fieldOnChange}
            repository={repository}
            fieldValue={userContent.Avatar as any}
            settings={defaultSettings}
          />,
        )
      })
      wrapper.find(IconButton).first().simulate('click')
      await act(async () => {
        wrapper.find(AvatarPicker).prop('select')(selectedContent)
      })
      wrapper.find(Button).last().simulate('click')
      expect(fieldOnChange).toBeCalled()
    })
  })
})
