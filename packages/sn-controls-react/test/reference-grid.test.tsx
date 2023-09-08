import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import { ODataParams } from '@sensenet/client-core'
import { sleepAsync } from '@sensenet/client-utils'
import { Folder } from '@sensenet/default-content-types'
import { Picker } from '@sensenet/pickers-react'
import { mount, ReactWrapper, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization } from '../src/fieldcontrols'
import { DefaultItemTemplate } from '../src/fieldcontrols/reference-grid/default-item-template'
import { ReferenceGrid } from '../src/fieldcontrols/reference-grid/reference-grid'
import { ReferencePicker } from '../src/fieldcontrols/reference-grid/reference-picker'

const defaultSettings = {
  Type: 'ReferenceFieldSetting',
  AllowedTypes: ['User', 'Group', 'Image'],
  SelectionRoots: ['/Root/IMS', '/Root'],
  Name: 'Members',
  FieldClassName: 'SenseNet.ContentRepository.Fields.ReferenceField',
  DisplayName: 'Members',
  Description: 'The members of this group.',
}

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

const imageContent = {
  Name: 'Test Image',
  Path: '/Root/Content/Images/Picture.jpg',
  DisplayName: 'Test Image',
  Id: 4830,
  Type: 'Image',
  Enabled: true,
  PageCount: 0,
}

const imageContentWithPreview = {
  Name: 'Test Image',
  Path: '/Root/Content/Images/Picture.jpg',
  DisplayName: 'Test Image',
  Id: 4830,
  Type: 'Image',
  Enabled: true,
  PageCount: 1,
  Version: 'v1.0.A',
}

const repository: any = {
  load: jest.fn((props) => {
    return { d: userContent }
  }),
  loadCollection: () => {
    return { d: { results: [] } }
  },
  schemas: {
    isContentFromType: jest.fn(() => true),
  },
  configuration: {
    repositoryUrl: 'url',
  },
}

describe('Reference grid field control', () => {
  describe('in browse view', () => {
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<ReferenceGrid actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).text()).toBe(defaultLocalization.referenceGrid.noValue)
    })

    it('should show no value message when field value is empty array', () => {
      const wrapper = shallow(<ReferenceGrid actionName="browse" settings={defaultSettings} fieldValue={[] as any} />)
      expect(wrapper.find(Typography).text()).toBe(defaultLocalization.referenceGrid.noValue)
    })

    it('should render the default item template when there is a field value', async () => {
      const wrapper = mount(
        <ReferenceGrid actionName="browse" settings={defaultSettings} content={userContent} repository={repository} />,
      )

      await act(async () => {
        await sleepAsync(0)
        wrapper.update()
      })

      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(1)
      expect(wrapper.find(InputLabel).text()).toBe(defaultSettings.DisplayName)
    })

    it('should create an allowed type list filter', async () => {
      const fieldSettings = { ...defaultSettings }

      let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
      await act(async () => {
        wrapper = mount(
          <ReferencePicker repository={repository} fieldSettings={fieldSettings} path="" defaultValue={[]} />,
        )
      })

      expect((wrapper!.update().find(Picker).prop('itemsODataOptions') as ODataParams<Folder>).filter).toBe(
        "isOf('Folder') or isOf('User') or isOf('Group') or isOf('Image')",
      )
    })

    it('should create a default allowed type list filter', async () => {
      const fieldSettings = { ...defaultSettings, AllowedTypes: undefined }

      let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
      await act(async () => {
        wrapper = mount(
          <ReferencePicker repository={repository} fieldSettings={fieldSettings} path="" defaultValue={[]} />,
        )
      })

      expect((wrapper!.update().find(Picker).prop('itemsODataOptions') as ODataParams<Folder>).filter).toBe(
        "isOf('GenericContent')",
      )
    })
  })
  describe('in edit/new view', () => {
    it('should throw error when no repository is passed', () => {
      // Don't show console errors when tests runs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
      mount(<ReferenceGrid actionName="edit" settings={defaultSettings} />)
      expect(consoleSpy).toBeCalled()
      // Restore console.errors
      jest.restoreAllMocks()
    })

    it('should show empty content when no field value is passed', () => {
      const wrapper = shallow(<ReferenceGrid actionName="new" settings={defaultSettings} repository={repository} />)
      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(1)
      expect(wrapper.find(DefaultItemTemplate).prop('content').DisplayName).toBe('Add reference')
    })

    it('should set default value', async () => {
      const wrapper = mount(
        <ReferenceGrid
          actionName="new"
          settings={{ ...defaultSettings, DefaultValue: userContent.Path }}
          repository={repository}
        />,
      )
      await act(async () => {
        await sleepAsync(0)
      })
      wrapper.update()
      expect(wrapper.find(DefaultItemTemplate).first().prop('content').DisplayName).toBe(userContent.DisplayName)
    })

    it('should open dialog when empty content is clicked', () => {
      const wrapper = shallow(<ReferenceGrid actionName="new" settings={defaultSettings} />)
      wrapper.find(DefaultItemTemplate).prop('add')()
      expect(wrapper.find(Dialog).prop('open')).toBeTruthy()
    })

    it('should show only the field value when it is readonly', async () => {
      const wrapper = mount(
        <ReferenceGrid actionName="edit" repository={repository} settings={{ ...defaultSettings, ReadOnly: true }} />,
      )
      await act(async () => {
        await sleepAsync(0)
        wrapper.update()
      })

      // if readonly were false then the length would be 2 because of the add reference row
      expect(wrapper.find(DefaultItemTemplate)).toHaveLength(1)
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

      await act(async () => {
        await sleepAsync(0)
        wrapper.update()
      })

      const remove = wrapper.find(DefaultItemTemplate).first().prop('remove')
      act(() => remove?.(4804))

      expect(fieldOnChange).toBeCalled()
      // To have a length 1 means that add reference row is remained there
      expect(wrapper.update().find(DefaultItemTemplate)).toHaveLength(1)
    })

    it('should allow user to add a new row, when allow multiple is true', async () => {
      const fieldOnChange = jest.fn()
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <ReferenceGrid
            fieldOnChange={fieldOnChange}
            actionName="edit"
            repository={repository}
            settings={{ ...defaultSettings, AllowMultiple: true }}
          />,
        )
      })

      wrapper.find(DefaultItemTemplate).last().find(IconButton).simulate('click')

      await act(async () => {
        wrapper.find(ReferencePicker).prop('handleSubmit')([
          userContent,
          { Path: '/', Name: 'Jane Doe', Id: 1234, Type: 'User' },
        ])
      })

      expect(fieldOnChange).toBeCalled()
      expect(wrapper.update().find(DefaultItemTemplate)).toHaveLength(3)
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

      wrapper.find(ReferencePicker).prop('handleSubmit')!([{ Path: '/', Name: 'Jane Doe', Id: 1234, Type: 'User' }])

      // Jane Doe + add reference
      expect(wrapper.update().find(DefaultItemTemplate)).toHaveLength(2)
    })

    it('should render the monogram of Displayname when no Avatar.Url is provided', async () => {
      const repo = {
        loadCollection: jest.fn(() => {
          return { d: { results: [{ ...userContent, Avatar: { Url: '' } }] } }
        }),
        schemas: repository.schemas,
      } as any
      let wrapper: any
      await act(async () => {
        wrapper = mount(<ReferencePicker repository={repo} fieldSettings={defaultSettings} path="" defaultValue={[]} />)
      })

      expect(wrapper.update().find(Avatar).text()).toBe('A.M')
    })

    it('should render img tag if type is image but PageCount is 0', async () => {
      const repo = {
        loadCollection: jest.fn(() => {
          return { d: { results: [{ ...imageContent }] } }
        }),
        schemas: {
          isContentFromType: jest.fn((a, b) => b === 'Image'),
        },
        configuration: repository.configuration,
      } as any
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <ReferencePicker repository={repo} fieldSettings={{ ...defaultSettings, Type: 'Image' }} path="" />,
        )
      })

      expect(wrapper.update().find('img').prop('src')).toContain(imageContent.Path)
      expect(wrapper.update().find('img').prop('alt')).toBe(imageContent.DisplayName)
    })

    it('should render img tag with thumbnail if type is image but PageCount is greater than 0', async () => {
      const repo = {
        loadCollection: jest.fn(() => {
          return { d: { results: [{ ...imageContentWithPreview }] } }
        }),
        schemas: {
          isContentFromType: jest.fn((a, b) => b === 'Image'),
        },
        configuration: repository.configuration,
      } as any
      let wrapper: any
      await act(async () => {
        wrapper = mount(
          <ReferencePicker repository={repo} fieldSettings={{ ...defaultSettings, Type: 'Image' }} path="" />,
        )
      })

      expect(wrapper.update().find('img').prop('src')).toContain(
        `${imageContentWithPreview.Path}/Previews/${imageContentWithPreview.Version}/thumbnail1.png`,
      )
      expect(wrapper.update().find('img').prop('alt')).toBe(imageContentWithPreview.DisplayName)
    })
  })
})
