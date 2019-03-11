import { Injectable } from '@furystack/inject'
import { ObservableValue } from '@sensenet/client-utils'
import { PlatformDependent } from '../context/ResponsiveContextProvider'

const settingsKey = `SN-APP-USER-SETTINGS`

export interface UiSettings {
  theme: 'dark' | 'light'
  content: { browseType: 'explorer' | 'commander' | 'simple' }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    type: 'temporary' | 'permanent' | 'mini-variant'
    items: string[]
  }
}

export type PersonalSettingsType = PlatformDependent<UiSettings> & {
  repositories: Array<{ url: string; loginName?: string }>
  lastRepository: string
}

export const defaultSettings: PersonalSettingsType = {
  default: {
    theme: 'dark',
    content: {
      browseType: 'explorer',
    },
    drawer: {
      enabled: true,
      type: 'mini-variant',
      items: ['Content'],
    },
    commandPalette: { enabled: true, wrapQuery: '${0} .AUTOFILTERS:OFF' },
  },
  mobile: {
    drawer: {
      type: 'temporary',
    },
    content: {
      browseType: 'simple',
    },
  },
  repositories: [],
  lastRepository: '',
}

@Injectable()
export class PersonalSettings {
  constructor() {
    this.init()
  }

  private async init() {
    const currentUserSettings = await this.getLocalUserSettingsValue()
    this.currentValue.setValue({
      ...defaultSettings,
      ...currentUserSettings,
    })
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
    this.currentValue.setValue(settings)
    localStorage.setItem(`${settingsKey}`, JSON.stringify(settings))
  }
}
