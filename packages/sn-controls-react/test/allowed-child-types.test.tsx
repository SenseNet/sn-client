import { sleepAsync } from '@sensenet/client-utils'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { AllowedChildTypes } from '../src/fieldcontrols'

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

const typesFromCtd = [
  {
    Id: 1,
    DisplayName: 'User',
    Icon: 'User',
    Name: 'User',
    Path: '/Root/System/Schema/ContentTypes/GenericContent/User',
    Type: 'ContentType',
  },
  {
    Id: 2,
    DisplayName: 'Group',
    Icon: 'Group',
    Name: 'Group',
    Path: '/Root/System/Schema/ContentTypes/GenericContent/Group',
    Type: 'ContentType',
  },
]

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
  allowedChildTypes: {
    getFromCTD: jest.fn(() => {
      return { d: { results: typesFromCtd } }
    }),
  },
  executeAction: jest.fn(() => {
    return { d: { results: typesFromCtd } }
  }),
  load: jest.fn(() => {
    return { d: { EffectiveAllowedChildTypes: [] } }
  }),
} as any

describe('Allowed child types control', () => {
  it('should write to console when no repository is provided', () => {
    // Don't show console errors when tests runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    mount(<AllowedChildTypes actionName="browse" settings={defaultSettings} />)
    expect(consoleSpy).toBeCalled()
    // Restore console.errors
    jest.restoreAllMocks()
  })

  it('should list allowed child types in browse view', async () => {
    const wrapper = mount(
      <AllowedChildTypes
        actionName="browse"
        settings={defaultSettings}
        content={userContent}
        repository={repository}
      />,
    )
    await act(async () => {
      await sleepAsync(0)
    })

    expect(wrapper.update().find(ListItemText).first().text()).toBe(typesFromCtd[0].DisplayName)
    expect(wrapper.update().find(ListItemText).at(1).text()).toBe(typesFromCtd[1].DisplayName)
  })

  it('should show allowed child types in edit view', async () => {
    const wrapper = mount(
      <AllowedChildTypes actionName="edit" settings={defaultSettings} content={userContent} repository={repository} />,
    )

    await act(async () => {
      await sleepAsync(0)
    })

    // secondaryAction is present in the main list, but not in the select suggestions
    expect(wrapper.update().find(ListItemSecondaryAction)).toHaveLength(2)
  })

  it('should handle remove from main list', async () => {
    const wrapper = mount(
      <AllowedChildTypes actionName="edit" settings={defaultSettings} content={userContent} repository={repository} />,
    )
    await act(async () => {
      await sleepAsync(0)
    })
    wrapper.update()
    const removeButton = wrapper.find(IconButton).first()
    expect(removeButton.prop('aria-label')).toBe('Remove')
    act(() => {
      removeButton.simulate('click')
    })
    wrapper.update()
    expect(wrapper.update().find(ListItemSecondaryAction)).toHaveLength(1)
  })

  it('should handle input change and adding a new item to the list', async () => {
    const fieldOnChange = jest.fn()
    const wrapper = mount(
      <AllowedChildTypes
        actionName="edit"
        fieldOnChange={fieldOnChange}
        settings={defaultSettings}
        content={userContent}
        repository={repository}
      />,
    )
    await act(async () => {
      await sleepAsync(0)
    })
    wrapper.update()
    const input = wrapper.find(TextField)
    act(() => {
      input.simulate('click')
      input.simulate('change', { target: { value: 'Alba' } })
    })
    wrapper.update()
    // select list item
    wrapper.find(ListItem).last().simulate('click')
    // add it to main list
    wrapper.find(IconButton).last().simulate('click')

    expect(fieldOnChange).toBeCalled()
  })
})
