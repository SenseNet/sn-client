import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import DefaultLocalization from '../localization/default'
import { LocalizationService } from '../services/LocalizationService'
import { PersonalSettingsContext } from './PersonalSettingsContext'
export const LocalizationContext = React.createContext({
  // tslint:disable-next-line: no-unnecessary-type-annotation
  setLanguage: (_language: string) => {
    /** */
  },
  service: new LocalizationService(),
  values: DefaultLocalization,
})

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
        setLanguage: lang => setCurrentLanguage(lang),
        values: currentValues,
        service: localizationService,
      }}>
      {props.children}
    </LocalizationContext.Provider>
  )
}
