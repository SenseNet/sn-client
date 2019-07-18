import React, { useEffect, useState } from 'react'
import { useInjector } from '../hooks'
import { defaultSettings, PersonalSettings } from '../services/PersonalSettings'
export const PersonalSettingsContext = React.createContext(defaultSettings)
export const PersonalSettingsContextProvider: React.StatelessComponent = props => {
  const di = useInjector()
  const settingsService = di.getInstance(PersonalSettings)
  const [settings, setSettings] = useState(settingsService.effectiveValue.getValue())
  useEffect(() => {
    settingsService.effectiveValue.subscribe(s => {
      setSettings(s)
    })
  }, [settingsService.effectiveValue])
  return <PersonalSettingsContext.Provider value={settings}>{props.children}</PersonalSettingsContext.Provider>
}
