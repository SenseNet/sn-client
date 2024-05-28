import { deepMerge, Injectable, LogLevel, ObservableValue, tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { BrowseType } from '../components/content'
import { PlatformDependent } from '../context'

const settingsKey = `SN-APP-USER-SETTINGS`
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export interface UiSettings {
  content: {
    browseType: (typeof BrowseType)[number]
    fields: Array<ColumnSetting<GenericContent>>
    root: string
  }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    type: 'temporary' | 'permanent' | 'mini-variant'
    items: Array<CustomDrawerItem<any>>
  }
}

export const CustomDrawerItemType = tuple('CustomContent')

export const BuiltInDrawerItemType = tuple(
  'Content',
  'ContentTypes',
  'SavedQueries',
  'Trash',
  'UsersAndGroups',
  'System',
  'ContentTemplates',
)

export const ActionType = tuple(
  'Browse',
  'Edit',
  'GetPermissions',
  'SetPermissions',
  'Reject',
  'RestoreVersion',
  'Purge',
  'ShareContent',
  'Rename',
  'GetAllContentTypes',
  'GetAllowedUsers',
  'GetQueries',
  'Approve',
  'Checkout',
  'CopyTo',
  'MoveTo',
  'Publish',
  'SaveQuery',
  'SetPermissions',
  'Share',
  'Delete',
  'UndoCheckOut',
  'Versions',
  'CheckIn',
  'Add',
  'Upload',
)

export interface DrawerItem<T> {
  settings?: T
  itemType: (typeof CustomDrawerItemType)[number] | (typeof BuiltInDrawerItemType)[number]
  permissions?: Array<{
    path: string
    action: (typeof ActionType)[number]
  }>
  systemItem?: boolean
}

export interface CustomDrawerItem<T> extends DrawerItem<T> {
  itemType: (typeof CustomDrawerItemType)[number]
}

export interface CustomContentDrawerItem
  extends DrawerItem<{
    root: string
    appPath: string
    columns?: Array<keyof GenericContent>
  }> {
  itemType: 'CustomContent'
}

export type PersonalSettingsType = PlatformDependent<UiSettings> & {
  eventLogSize: number
  sendLogWithCrashReports: boolean
  logLevel: Array<keyof typeof LogLevel>
  language: 'default' | 'hungarian'
  theme: 'light' | 'dark'
  uploadHandlers: string[]
}

export const defaultSettings: PersonalSettingsType = {
  default: {
    content: {
      browseType: 'explorer',
      fields: [
        { field: 'DisplayName' as keyof GenericContent },
        { field: 'Locked' as keyof GenericContent },
        { field: 'CreatedBy' as keyof GenericContent },
        { field: 'Actions' as keyof GenericContent },
      ],
      root: '/Root/Content',
    },
    drawer: {
      enabled: true,
      type: 'mini-variant',
      items: [
        {
          itemType: CustomDrawerItemType[0],
          settings: {
            root: '/Root',
            appPath: 'root',
          },
          permissions: [
            {
              path: '/Root',
              action: 'Browse',
            },
          ],
          systemItem: true,
        },
      ],
    },
    commandPalette: { enabled: true, wrapQuery: '{0} .AUTOFILTERS:OFF' },
  },
  mobile: {
    drawer: {
      type: 'temporary',
    },
  },
  language: 'default',
  eventLogSize: 500,
  sendLogWithCrashReports: true,
  logLevel: ['Information', 'Warning', 'Error', 'Fatal'],
  theme: prefersDark ? 'dark' : 'light',
  uploadHandlers: [
    'SenseNet.ContentRepository.File',
    'SenseNet.ContentRepository.Image',
    'SenseNet.ContentRepository.Settings',
  ],
}

@Injectable({ lifetime: 'singleton' })
export class PersonalSettings {
  private checkDrawerItems(settings: Partial<PersonalSettingsType>): Partial<PersonalSettingsType> {
    if (settings.default?.drawer?.items?.find((i) => typeof i === 'string')) {
      ; (settings.default.drawer.items as any) = undefined
    }

    if (settings.desktop?.drawer?.items?.find((i) => typeof i === 'string')) {
      ; (settings.desktop.drawer.items as any) = undefined
    }

    if (settings.tablet?.drawer?.items?.find((i) => typeof i === 'string')) {
      ; (settings.tablet.drawer.items as any) = undefined
    }

    if (settings.mobile?.drawer?.items?.find((i) => typeof i === 'string')) {
      ; (settings.mobile.drawer.items as any) = undefined
    }

    return settings
  }

  private checkValues(settings: Partial<PersonalSettingsType>): Partial<PersonalSettingsType> {
    return this.checkDrawerItems(settings)
  }

  public getLocalUserSettingsValue(): Partial<PersonalSettingsType> {
    try {
      const stored = JSON.parse((localStorage.getItem(`${settingsKey}`) as string) || '{}')
      return this.checkValues(stored)
    } catch {
      /** */
    }
    return {}
  }

  public userValue = new ObservableValue<Partial<PersonalSettingsType>>(this.getLocalUserSettingsValue())

  public effectiveValue = new ObservableValue(deepMerge(defaultSettings, this.userValue.getValue()))

  public setPersonalSettingsValue(settings: Partial<PersonalSettingsType>) {
    this.userValue.setValue(settings)
    this.effectiveValue.setValue(deepMerge(defaultSettings, settings))
    localStorage.setItem(`${settingsKey}`, JSON.stringify(settings))
  }
}
