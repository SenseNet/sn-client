import { sleepAsync } from '@sensenet/client-utils'
import Chip from '@material-ui/core/Chip'
import FormGroup from '@material-ui/core/FormGroup'
import Select from '@material-ui/core/Select'
import SvgIcon from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization, TagsInput } from '../src/fieldcontrols'

const userContent = {
  Name: 'Alba Monday',
  Path: '/Root/IMS/Public/alba',
  DisplayName: 'Alba Monday',
  Id: 4804,
  Type: 'User',
  BirthDate: new Date(2000, 5, 15).toISOString(),
  Avatar: { Url: '/Root/Sites/Default_Site/demoavatars/alba.jpg' },
  Enabled: true,
  Manager: {
    Name: 'Business Cat',
    Path: '/Root/IMS/Public/businesscat',
    DisplayName: 'Business Cat',
    Id: 4810,
    Type: 'User',
  },
}

const fileContent = {
  Name: 'SomeFile',
  Path: '/Root/Sites/SomeFile',
  DisplayName: 'Some File',
  Id: 415,
  Type: 'File',
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
  load: jest.fn(() => {
    return { d: userContent }
  }),
  schemas: {
    isContentFromType: jest.fn(() => true),
  },
  configuration: {
    repositoryUrl: 'url',
  },
}
describe('Tags input field control', () => {
  describe('in browse view', () => {
    it('should show the value of the field when content is passed', async () => {
      const wrapper = mount(
        <TagsInput
          actionName="browse"
          settings={{ ...defaultSettings, AllowMultiple: true }}
          content={userContent}
          repository={repository}
        />,
      )
      await act(async () => {
        await sleepAsync(0)
      })
      const updatedWrapper = wrapper.update()
      expect(updatedWrapper.find(FormGroup).find(Typography).props().children).toBe(userContent.DisplayName)
    })

    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<TagsInput actionName="browse" repository={repository} settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.tagsInput.noValue)
    })
  })

  describe('in edit/new view', () => {
    it('should throw error when no repository is passed', async () => {
      // Don't show console errors when tests runs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
      const wrapper = mount(<TagsInput actionName="edit" settings={defaultSettings} />)

      wrapper.update()
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

    it('should set default value', async () => {
      const wrapper = mount(
        <TagsInput
          actionName="new"
          settings={{ ...defaultSettings, DefaultValue: userContent.Path }}
          repository={repository}
        />,
      )
      await act(async () => {
        await sleepAsync(0)
      })
      wrapper.update()
      expect(wrapper.find(Select).prop('value')).toBe(userContent.Id)
    })

    it('should show the value of the field when content is passed', async () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const wrapper = mount(
        <TagsInput
          actionName="edit"
          settings={{ ...defaultSettings, AllowMultiple: true }}
          content={userContent}
          repository={repository}
        />,
      )
      expect(consoleSpy).not.toBeCalled()
      await act(async () => {
        await sleepAsync(0)
      })
      wrapper.update()
      expect(wrapper.find(Select).prop('value')).toHaveLength(1)
    })

    it('should remove a tag when X is clicked', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <TagsInput
          actionName="edit"
          settings={{ ...defaultSettings, AllowMultiple: true }}
          content={userContent}
          fieldOnChange={fieldOnChange}
          repository={
            {
              loadCollection: () => {
                return { d: { results: [{ ...userContent, Avatar: {} }] } }
              },
              load: () => {
                return { d: { ...userContent, Avatar: {} } }
              },
              schemas: repository.schemas,
              configuration: {
                repositoryUrl: 'url',
              },
            } as any
          }
        />,
      )
      await act(async () => {
        await sleepAsync(0)
      })
      wrapper.update()
      act(() => {
        wrapper.find(Chip).find(SvgIcon).simulate('click')
      })
      wrapper.update()
      expect(wrapper.find(Select).prop('value')).toHaveLength(0)
      expect(fieldOnChange).toBeCalled()
    })

    it('should remove a tag when X is clicked and it is not a user', async () => {
      const fieldOnChange = jest.fn()
      const repositoryForFileContent = {
        loadCollection: jest.fn(() => {
          return { d: { results: [fileContent, { ...fileContent, Id: 311 }] } }
        }),
        load: () => {
          return { d: { results: [fileContent, { ...fileContent, Id: 311 }] } }
        },
        schemas: {
          isContentFromType: jest.fn(() => false),
        },
        configuration: {
          repositoryUrl: 'url',
        },
      }
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <TagsInput
            actionName="edit"
            settings={{ ...defaultSettings, AllowMultiple: true }}
            content={fileContent}
            fieldOnChange={fieldOnChange}
            repository={repositoryForFileContent as any}
          />,
        )
      })

      wrapper.update().find(Chip).find(SvgIcon).at(1).simulate('click')
      expect(wrapper.find(Select).prop('value')).toHaveLength(1)
      expect(fieldOnChange).toBeCalledWith(defaultSettings.Name, [fileContent.Id])
    })

    it('should handle selection change', async () => {
      const fieldOnChange = jest.fn()
      const wrapper = mount(
        <TagsInput
          actionName="new"
          settings={{ ...defaultSettings, AllowMultiple: true }}
          fieldOnChange={fieldOnChange}
          repository={repository}
        />,
      )
      await act(async () => {
        await sleepAsync(0)
      })
      wrapper.update()
      const onChange = wrapper.find(Select).prop('onChange')
      act(() => {
        onChange?.({ target: { value: [1120, 4804] } } as any, {})
      })
      wrapper.update()
      expect(fieldOnChange).toBeCalled()
    })
  })
})
