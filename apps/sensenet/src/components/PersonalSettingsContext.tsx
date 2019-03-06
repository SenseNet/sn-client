import { useContext, useEffect, useState } from 'react'
import React from 'react'
import { defaultSettings, PersonalSettings } from '../services/PersonalSettings'
import { InjectorContext } from './InjectorContext'
export const PersonalSettingsContext = React.createContext(defaultSettings)
export const PersonalSettingsContextProvider: React.StatelessComponent = props => {
  const di = useContext(InjectorContext)
  const settingsService = di.GetInstance(PersonalSettings)
  const [settings, setSettings] = useState(settingsService.currentValue.getValue())
  useEffect(() => {
    settingsService.currentValue.subscribe(s => {
      setSettings(s)
    })
  }, [])
  return <PersonalSettingsContext.Provider value={settings}>{props.children}</PersonalSettingsContext.Provider>
}
