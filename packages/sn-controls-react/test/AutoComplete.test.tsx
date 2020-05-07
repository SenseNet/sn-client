import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { ReferenceField } from '@sensenet/search-react'
import { AutoComplete } from '../src/fieldcontrols/AutoComplete'

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

const repository = {
  loadCollection: jest.fn(() => {
    return { d: { results: [userContent] } }
  }),
} as any

describe('Auto complete field control', () => {
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const wrapper = shallow(
        <AutoComplete fieldValue={[userContent] as any} actionName="browse" settings={defaultSettings} />,
      )
      expect(wrapper.find(Typography).first().text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Typography).last().text()).toBe(userContent.DisplayName)
      expect(wrapper).toMatchSnapshot()
    })

    it('should not show anything when field value is not provided', () => {
      const wrapper = shallow(<AutoComplete actionName="browse" settings={defaultSettings} />)
      expect(wrapper.get(0)).toBeFalsy()
    })
  })
  describe('in edit/new view', () => {
    it('should throw an error when no repository is provided', async () => {
      // Don't show console errors when tests runs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
      const wrapper = mount(<AutoComplete actionName="edit" settings={defaultSettings} />)
      wrapper.find(ReferenceField).prop('fetchItems')({} as any)
      expect(consoleSpy).toBeCalled()
      // Restore console.errors
      jest.restoreAllMocks()
    })

    it('should call onchange when an item is selected', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <AutoComplete
          actionName="edit"
          fieldOnChange={fieldOnChange}
          repository={repository}
          settings={defaultSettings}
        />,
      )
      wrapper.find(ReferenceField).prop('fetchItems')({ addSegment: jest.fn() } as any)
      const onChange = wrapper.find(ReferenceField).prop('onChange')
      onChange && onChange(userContent)
      expect(fieldOnChange).toBeCalled()
    })
  })
})
