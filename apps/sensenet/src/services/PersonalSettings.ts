import { Injectable } from '@furystack/inject'
import { LogLevel } from '@furystack/logging'
import { deepMerge, ObservableValue } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { PlatformDependent } from '../context'
import { tuple } from '../utils/tuple'

const settingsKey = `SN-APP-USER-SETTINGS`

export interface UiSettings {
  theme: 'dark' | 'light'
  content: {
    browseType: 'explorer' | 'commander' | 'simple'
    fields: Array<keyof GenericContent>
  }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    type: 'temporary' | 'permanent' | 'mini-variant'
    items: string[]
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

export type PersonalSettingsType = PlatformDependent<UiSettings> & {
  repositories: Array<{ url: string; loginName?: string; displayName?: string; dashboard?: WidgetSection }>
  lastRepository: string
  dashboards: {
    globalDefault: WidgetSection
    repositoryDefault: WidgetSection
  }
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
          query: "+TypeIs:'User'",
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
        title: 'Tutorials',
        widgetType: 'markdown',
        settings: {
          content:
            '[Overview](https://index.hu) \n\n [Getting started](https://index.hu) \n\n [Tutorials](https://index.hu) \n\n [Example apps](https://index.hu) \n\n ',
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
            ' [Content Delivery API](https://index.hu) \n\n [Images API](https://index.hu) \n\n [Content management API](https://index.hu) \n\n [Content preview API](https://index.hu) \n\n',
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
            "<div style='text-align:center;'><a target='_blank' href='https://index.hu' style='text-decoration: none;'><button class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-contained'>Contact us</button></a></div>",
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
      items: ['Search', 'Content', 'Users and Groups', 'Content Types', 'Localization', 'Setup', 'Version info'],
    },
    commandPalette: { enabled: true, wrapQuery: '${0} .AUTOFILTERS:OFF' },
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
  constructor() {
    this.init()
  }

  private async init() {
    const currentUserSettings = await this.getLocalUserSettingsValue()
    this.currentValue.setValue(deepMerge(defaultSettings, currentUserSettings))
  }

  public async getLocalUserSettingsValue(): Promise<Partial<PersonalSettingsType>> {
    try {
      return JSON.parse(localStorage.getItem(`${settingsKey}`) as string)
    } catch {
      /** */
    }
    return {}
  }

  public currentValue = new ObservableValue(defaultSettings)

  public async setValue(settings: PersonalSettingsType) {
    this.currentValue.setValue({ ...settings })
    localStorage.setItem(`${settingsKey}`, JSON.stringify(settings))
  }
}
