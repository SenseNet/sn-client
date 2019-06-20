import { Injectable } from '@furystack/inject'
import { LogLevel } from '@furystack/logging'
import { ObservableValue, deepMerge } from '@sensenet/client-utils'
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

export const widgetTypes = tuple('markdown', 'query')

export interface Widget<T> {
  title: string
  widgetType: typeof widgetTypes[number]
  settings: T
  minWidth?: number
}

export interface MarkdownWidget extends Widget<{ content: string }> {
  widgetType: 'markdown'
}

export interface QueryWidget<T extends GenericContent>
  extends Widget<{
    columns: Array<keyof T>
    showColumnNames: boolean
    showRefresh?: boolean
    showOpenInSearch?: boolean
    top?: number
    query: string
  }> {
  widgetType: 'query'
}

export type WidgetSection = Array<MarkdownWidget | QueryWidget<GenericContent>>

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
        title: 'Global Dashboard',
        widgetType: 'markdown',
        settings: {
          content:
            '# alma \\r\\n áááá [jeeeee](https://imgix.ranker.com/user_node_img/50088/1001748292/original/like-a-turtle-and-part-fish-photo-u4?w=650&q=50&fm=pjpg&fit=crop&crop=faces "teknőc e")',
        },
      },
      {
        title: 'Example Query',
        widgetType: 'query',
        settings: {
          columns: ['Name', 'Id', 'Path'],
          showColumnNames: false,
          top: 3,
          query: '+alba',
        },
      },
    ],
    repositoryDefault: [],
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
      items: ['Content', 'Search', 'Version info'],
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
