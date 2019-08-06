import React from 'react'
import { mount, shallow } from 'enzyme'
import InputLabel from '@material-ui/core/InputLabel'
import Dialog from '@material-ui/core/Dialog'
import { sleepAsync } from '@sensenet/client-utils'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { useAsync } from 'react-async'
import { ReferenceGrid } from '../src/fieldcontrols/ReferenceGrid/ReferenceGrid'
import { DefaultItemTemplate } from '../src/fieldcontrols/ReferenceGrid/DefaultItemTemplate'
import { ReferencePicker } from '../src/fieldcontrols/ReferenceGrid/ReferencePicker'

jest.mock('react-async')

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
  load: jest.fn(() => {
    return { d: { results: [userContent, { Id: 2123, Name: 'Jon Doe', Type: 'User', Path: '/' }] } }
  }),
  configuration: {
    repositoryUrl: 'url',
  },
}

describe('Reference grid field control', () => {
  describe('in browse view', () => {
    it('should render null when no fieldValue is provided', () => {
      const wrapper = shallow(<ReferenceGrid actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
    it('should render the default item template when there is a field value', () => {
      const wrapper = shallow(
        <ReferenceGrid actionName="browse" settings={defaultSettings} fieldValue={[userContent] as any} />,
      )

      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(1)
      expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
    })
  })
  describe('in edit/new view', () => {
    it('should throw error when no repository is passed', () => {
      // Don't show console errors when tests runs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
      shallow(<ReferenceGrid actionName="edit" settings={defaultSettings} />)
      expect(consoleSpy).toBeCalled()
      // Restore console.errors
      jest.restoreAllMocks()
    })

    it('should show empty content when no field value is passed', () => {
      const wrapper = shallow(<ReferenceGrid actionName="new" settings={defaultSettings} />)
      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(1)
      expect(wrapper.find(DefaultItemTemplate).prop('content').DisplayName).toBe('Add reference')
    })

    it('should open dialog when empty content is clicked', () => {
      const wrapper = shallow(<ReferenceGrid actionName="new" settings={defaultSettings} />)
      wrapper.find(DefaultItemTemplate).prop('add')()
      expect(wrapper.find(Dialog).prop('open')).toBeTruthy()
    })

    it('should show only the field value when it is readonly', async () => {
      const wrapper = shallow(
        <ReferenceGrid actionName="edit" repository={repository} settings={{ ...defaultSettings, ReadOnly: true }} />,
      )
      await sleepAsync(0)
      // if readonly were false then the length would be 3 because of the add reference row
      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(2)
    })

    it('should handle item deletion from the list', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <ReferenceGrid
          fieldOnChange={fieldOnChange}
          actionName="edit"
          repository={repository}
          settings={defaultSettings}
        />,
      )
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()

      const remove = updatedWrapper
        .find(DefaultItemTemplate)
        .first()
        .prop('remove')
      remove && remove(4804)
      expect(fieldOnChange).toBeCalled()
      // To have a length 2 means that add reference row is there as well
      expect(updatedWrapper.update().find(DefaultItemTemplate)).toHaveLength(2)
    })

    it('should allow user to add a new row, when allow multiple is true', async () => {
      const fieldOnChange = jest.fn()
      ;(useAsync as any).mockReturnValue({ data: undefined, isLoading: true })
      const wrapper = mount(
        <ReferenceGrid
          fieldOnChange={fieldOnChange}
          actionName="edit"
          repository={repository}
          settings={{ ...defaultSettings, AllowMultiple: true }}
        />,
      )
      await sleepAsync(0)
      const updatedWrapper = wrapper.update()

      updatedWrapper
        .find(DefaultItemTemplate)
        .last()
        .find(IconButton)
        .simulate('click')
      updatedWrapper.find(ReferencePicker).prop('select')({ Path: '/', Name: 'Jane Doe', Id: 1234, Type: 'User' })
      updatedWrapper
        .find(Dialog)
        .find(Button)
        .first()
        .simulate('click')
      expect(fieldOnChange).toBeCalled()
      expect(updatedWrapper.find(DefaultItemTemplate)).toHaveLength(4)
    })

    it('should remove all the items when a new item is selected with allow multiple false', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = shallow(
        <ReferenceGrid
          fieldOnChange={fieldOnChange}
          actionName="edit"
          repository={repository}
          settings={defaultSettings}
        />,
      )
      await sleepAsync(0)

      wrapper.find(ReferencePicker).prop('select')({ Path: '/', Name: 'Jane Doe', Id: 1234, Type: 'User' })
      wrapper
        .find(Dialog)
        .find(Button)
        .first()
        .simulate('click')
      // Jane Doe + add reference
      expect(wrapper.update().find(DefaultItemTemplate)).toHaveLength(2)
    })
  })
})
