import React, { useContext, useEffect, useState } from 'react'
import { useInjector } from '../hooks'
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
  const injector = useInjector()
  const [localizationService] = useState(injector.getInstance(LocalizationService))
  const [currentValues, setCurrentValues] = useState({ ...DefaultLocalization })
  const personalSettings = useContext(PersonalSettingsContext)

  useEffect(() => {
    const observable = localizationService.currentValues.subscribe(v => {
      setCurrentValues(v)
    })
    return () => observable.dispose()
  }, [])

  useEffect(() => {
    localizationService.load(personalSettings.language)
  }, [personalSettings.language])

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
