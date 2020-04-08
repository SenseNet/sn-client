import React from 'react'
import { mount } from 'enzyme'
import ListItemText from '@material-ui/core/ListItemText'
import { sleepAsync } from '@sensenet/client-utils'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
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
  executeAction: jest.fn(() => {
    return { d: { results: [userContent] } }
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
    await sleepAsync(0)

    expect(wrapper.update().find(ListItemText).text()).toBe(userContent.DisplayName)
  })

  it('should show allowed child types in edit view', async () => {
    const wrapper = mount(
      <AllowedChildTypes actionName="edit" settings={defaultSettings} content={userContent} repository={repository} />,
    )
    await sleepAsync(0)

    // to have length 2 means that 1 is in the select and 1 in the main list
    expect(wrapper.update().find(ListItem)).toHaveLength(2)
  })

  it('should handle remove from main list', async () => {
    const wrapper = mount(
      <AllowedChildTypes actionName="edit" settings={defaultSettings} content={userContent} repository={repository} />,
    )
    await sleepAsync(0)
    wrapper.update()
    const removeButton = wrapper.find(IconButton).first()
    expect(removeButton.prop('aria-label')).toBe('Remove')
    removeButton.simulate('click')
    wrapper.update()
    expect(wrapper.update().find(ListItem)).toHaveLength(1)
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
    await sleepAsync(0)
    wrapper.update()
    const input = wrapper.find(TextField)
    input.simulate('click')
    input.simulate('change', { target: { value: 'Alba' } })
    wrapper.update()
    // select list item
    wrapper.find(ListItem).last().simulate('click')
    // add it to main list
    wrapper.find(IconButton).last().simulate('click')

    expect(fieldOnChange).toBeCalled()
  })
})
