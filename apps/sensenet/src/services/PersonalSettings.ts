import { deepMerge, Injectable, LogLevel, ObservableValue, tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { PlatformDependent } from '../context'
import { BrowseType } from '../components/content'

const settingsKey = `SN-APP-USER-SETTINGS`

export interface UiSettings {
  theme: 'dark' | 'light'
  content: {
    browseType: typeof BrowseType[number]
    fields: Array<keyof GenericContent>
  }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    type: 'temporary' | 'permanent' | 'mini-variant'
    items: Array<DrawerItem<any>>
  }
}

export const widgetTypes = tuple('markdown', 'query', 'updates')
export interface Widget<T> {
  title: string
  widgetType: typeof widgetTypes[number]
  settings: T
  minWidth?: PlatformDependent<number | string>
}

export interface MarkdownWidget extends Widget<{ content: string }> {
  widgetType: 'markdown'
}

export interface UpdatesWidget extends Widget<undefined> {
  widgetType: 'updates'
}

export interface QueryWidget<T extends GenericContent>
  extends Widget<{
    columns: Array<keyof T>
    showColumnNames: boolean
    showRefresh?: boolean
    showOpenInSearch?: boolean
    enableSelection?: boolean
    top?: number
    query: string
    emptyPlaceholderText?: string
    countOnly?: boolean
  }> {
  widgetType: 'query'
}

export type WidgetSection = Array<MarkdownWidget | QueryWidget<GenericContent> | UpdatesWidget>

export const DrawerItemType = tuple(
  'Content',
  'Query',
  'Content Types',
  'Query',
  'Localization',
  'Search',
  'Setup',
  'Trash',
  'Version info',
  'Users and groups',
  'Dashboard',
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
  itemType: typeof DrawerItemType[number]
  permissions?: Array<{
    path: string
    action: typeof ActionType[number]
  }>
}

export interface ContentDrawerItem
  extends DrawerItem<{
    root: string
    title: string
    description?: string
    icon: string
    columns?: Array<keyof GenericContent>
    browseType: typeof BrowseType[number]
  }> {
  itemType: 'Content'
}

export interface QueryDrawerItem
  extends DrawerItem<{
    title: string
    description?: string
    icon: string
    term: string
    columns: Array<keyof GenericContent>
  }> {
  itemType: 'Query'
}

export interface DashboardDrawerItem
  extends DrawerItem<{
    dashboardName: string
    title: string
    description?: string
    icon: string
  }> {
  itemType: 'Dashboard' | 'Users and groups'
}

export interface BuiltinDrawerItem extends DrawerItem<undefined> {
  itemType: 'Content Types' | 'Localization' | 'Search' | 'Setup' | 'Trash' | 'Version info' | 'Users and groups'
}

export type PersonalSettingsType = PlatformDependent<UiSettings> & {
  repositories: Array<{ url: string; loginName?: string; displayName?: string; dashboard?: WidgetSection }>
  lastRepository: string
  dashboards: {
    globalDefault: WidgetSection
    repositoryDefault: WidgetSection
  } & { [key: string]: WidgetSection }
  eventLogSize: number
  sendLogWithCrashReports: boolean
  logLevel: Array<keyof typeof LogLevel>
  language: 'default' | 'hungarian'
}

export const defaultSettings: PersonalSettingsType = {
  dashboards: {
    globalDefault: [
      {
        title: 'Welcome back, {currentUserName}',
        widgetType: 'markdown',
        settings: {
          content: "It's a great day to do admin stuff!",
        },
      },
    ],
    repositoryDefault: [
      {
        title: 'Welcome back, {currentUserName}',
        widgetType: 'markdown',
        settings: {
          content: "It's a great day to do admin stuff!",
        },
        minWidth: {
          default: '100%',
        },
      },
      {
        title: 'Packages to update',
        widgetType: 'updates',
        minWidth: {
          default: '100%',
        },
        settings: undefined,
      },
      {
        title: 'Number of users',
        widgetType: 'query',
        minWidth: { default: '30%' },
        settings: {
          query: "+(TypeIs:'User' AND InTree:'/Root/IMS/Public')",
          columns: [],
          countOnly: true,
          showColumnNames: false,
          showOpenInSearch: false,
          showRefresh: false,
        },
      },
      {
        title: 'Number of content items',
        widgetType: 'query',
        minWidth: { default: '30%' },
        settings: {
          query: "+TypeIs:'GenericContent'",
          columns: [],
          countOnly: true,
          showColumnNames: false,
        },
      },
      {
        title: 'Updates since yesterday',
        widgetType: 'query',
        minWidth: {
          default: '30%',
        },
        settings: {
          query: '+ModificationDate:>@@Yesterday@@',
          columns: [],
          countOnly: true,
          showColumnNames: false,
          showOpenInSearch: true,
        },
      },
      {
        title: 'Docs owned by me',
        widgetType: 'query',
        minWidth: {
          default: '100%',
        },
        settings: {
          query: "+(Owner:@@CurrentUser@@ AND TypeIs:'File')",
          columns: [],
          countOnly: true,
          showColumnNames: false,
          showOpenInSearch: true,
        },
      },
      {
        title: 'Docs shared with me',
        widgetType: 'query',
        minWidth: {
          default: '100%',
        },
        settings: {
          query: '+SharedWith:@@CurrentUser@@',
          columns: [],
          countOnly: true,
          showColumnNames: false,
          showOpenInSearch: true,
        },
      },
      {
        title: 'Concepts & Tutorials',
        widgetType: 'markdown',
        settings: {
          content:
            '<div>To get started with sensenet</div><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/docs/concepts/overview">Overview</a><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/tags/#getting+started">Getting started</a><br /><a href="https://community.sensenet.com/tutorials" style="color: #26a69a; line-height: 2rem">Tutorials</a><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/docs/examples">Example apps</a>',
        },
        minWidth: {
          default: '45%',
        },
      },
      {
        title: 'API documentation',
        widgetType: 'markdown',
        settings: {
          content:
            '<div>Discover capabilites of the API</div><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/docs/odata-rest-api/">REST API</a><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/docs/odata-rest-api/">Content Management API</a><br /><a href="https://community.sensenet.com/docs/built-in-odata-actions-and-functions/" style="color: #26a69a; line-height: 2rem">Document Preview API</a><br /><a style="color: #26a69a; line-height: 2rem" href="https://community.sensenet.com/docs/odata-rest-api/">User Management API</a>',
        },
        minWidth: {
          default: '45%',
        },
      },
      {
        title: 'Have any questions?',
        widgetType: 'markdown',
        settings: {
          content:
            "<div style='text-align:center;'>If you need any help or further information, feel free to contact us!<br /><br /><a target='_blank' href='https://www.sensenet.com/contact' style='text-decoration: none;'><button style='margin-bottom: 2em' class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-contained MuiButton-containedPrimary'>Contact us</button></a></div>",
        },
        minWidth: {
          default: '100%',
        },
      },
    ],
  },
  default: {
    theme: 'dark',
    content: {
      browseType: 'explorer',
      fields: ['DisplayName', 'CreatedBy', 'Actions'],
    },
    drawer: {
      enabled: true,
      type: 'mini-variant',
      items: [
        { itemType: 'Search', settings: undefined },
        {
          itemType: 'Content',
          settings: { root: '/Root/Content' },
          permissions: [{ path: '/Root/Content', action: 'Add' }],
        },
        {
          itemType: 'Users and groups',
          settings: undefined,
          permissions: [{ path: '/Root/IMS/Public', action: 'Add' }],
        },
        {
          itemType: 'Trash',
          settings: undefined,
          permissions: [{ path: '/Root/Trash', action: 'Edit' }],
        },
        {
          itemType: 'Content Types',
          settings: undefined,
          permissions: [{ path: '/Root/System/Schema/ContentTypes', action: 'Add' }],
        },
        {
          itemType: 'Localization',
          settings: undefined,
          permissions: [{ path: '/Root/Localization', action: 'Add' }],
        },
        { itemType: 'Setup', settings: undefined, permissions: [{ path: '/Root/System/Settings', action: 'Browse' }] },
        {
          itemType: 'Version info',
          settings: undefined,
          permissions: [{ path: '/Root/(apps)/PortalRoot/GetVersionInfo', action: 'Browse' }],
        },
      ],
    },
    commandPalette: { enabled: true, wrapQuery: '{0} .AUTOFILTERS:OFF' },
  },
  mobile: {
    drawer: {
      type: 'temporary',
    },
    content: {
      browseType: 'simple',
      fields: ['DisplayName'],
    },
  },
  repositories: [],
  lastRepository: '',
  language: 'default',
  eventLogSize: 500,
  sendLogWithCrashReports: true,
  logLevel: ['Information', 'Warning', 'Error', 'Fatal'],
}

@Injectable({ lifetime: 'singleton' })
export class PersonalSettings {
  private checkDrawerItems(settings: Partial<PersonalSettingsType>): Partial<PersonalSettingsType> {
    if (
      settings.default &&
      settings.default.drawer &&
      settings.default.drawer.items &&
      settings.default.drawer.items.find(i => typeof i === 'string')
    ) {
      ;(settings.default.drawer.items as any) = undefined
    }

    if (
      settings.desktop &&
      settings.desktop.drawer &&
      settings.desktop.drawer.items &&
      settings.desktop.drawer.items.find(i => typeof i === 'string')
    ) {
      ;(settings.desktop.drawer.items as any) = undefined
    }

    if (
      settings.tablet &&
      settings.tablet.drawer &&
      settings.tablet.drawer.items &&
      settings.tablet.drawer.items.find(i => typeof i === 'string')
    ) {
      ;(settings.tablet.drawer.items as any) = undefined
    }

    if (
      settings.mobile &&
      settings.mobile.drawer &&
      settings.mobile.drawer.items &&
      settings.mobile.drawer.items.find(i => typeof i === 'string')
    ) {
      ;(settings.mobile.drawer.items as any) = undefined
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
