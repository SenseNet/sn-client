import React, { useContext, useEffect, useState } from 'react'
import DefaultLocalization from '../localization/default'
import { LocalizationService } from '../services/LocalizationService'
import { PersonalSettingsContext } from './PersonalSettingsContext'

/**
 * Context that can be used for getting localization values
 */
export const LocalizationContext = React.createContext({
  service: new LocalizationService(),
  values: DefaultLocalization,
})

/**
 * Context provider for Localization values. Update the PersonalSettings.language to load a new language into the context.
 * @param props
 */
export const LocalizationProvider: React.FunctionComponent = props => {
  const [localizationService] = useState(new LocalizationService())
  const [currentLanguage, setCurrentLanguage] = useState('default')
  const [currentValues, setCurrentValues] = useState({ ...DefaultLocalization })
  const personalSettings = useContext(PersonalSettingsContext)

  useEffect(() => {
    setCurrentLanguage(personalSettings.language)
  }, [personalSettings.language])

  useEffect(() => {
    const observable = localizationService.currentValues.subscribe(v => {
      setCurrentValues(v)
    })
    return () => observable.dispose()
  }, [])

  useEffect(() => {
    localizationService.load(currentLanguage)
  }, [currentLanguage])

  return (
    <LocalizationContext.Provider
      value={{
        values: currentValues,
        service: localizationService,
      }}>
      {props.children}
    </LocalizationContext.Provider>
  )
}
