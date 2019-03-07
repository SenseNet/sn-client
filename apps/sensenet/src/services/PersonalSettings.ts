import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import { PlatformDependent } from '../components/ResponsiveContextProvider'

const settingsKey = `SN-APP-USER-SETTINGS`

export interface PersonalSettingType {
  theme: 'dark' | 'light'
  content: { browseType: 'explorer' | 'commander' | 'simple' }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    type: 'temporary' | 'permanent' | 'mini-variant'
    items: string[]
  }
}

export const defaultSettings: PlatformDependent<PersonalSettingType> = {
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
}

@Injectable()
export class PersonalSettings {
  constructor(private readonly repository: Repository) {
    this.repository.authentication.currentUser.subscribe(user => this.init(user), true)
  }

  private async init(user: User) {
    const currentUserSettings = await this.getLocalUserSettingsValue(user)
    this.currentValue.setValue({
      ...defaultSettings,
      ...currentUserSettings,
    })
  }

  public async getLocalUserSettingsValue(user: User): Promise<Partial<PersonalSettingType>> {
    try {
      return JSON.parse(localStorage.getItem(`${settingsKey}/${user.Path}`) as string)
    } catch {
      /** */
    }
    return {}
  }

  public currentValue = new ObservableValue(defaultSettings)

  public async setValue(settings: PlatformDependent<PersonalSettingType>) {
    this.currentValue.setValue(settings)
    localStorage.setItem(
      `${settingsKey}/${this.repository.authentication.currentUser.getValue().Path}`,
      JSON.stringify(settings),
    )
  }
}
