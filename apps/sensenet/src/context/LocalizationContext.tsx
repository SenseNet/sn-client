import { useInjector } from '@sensenet/hooks-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { usePersonalSettings } from '../hooks'
import DefaultLocalization from '../localization/default'
import { LocalizationService } from '../services/LocalizationService'

import 'moment/locale/hu'

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
export const LocalizationProvider: React.FunctionComponent = (props) => {
  const injector = useInjector()
  const [localizationService] = useState(injector.getInstance(LocalizationService))
  const [currentValues, setCurrentValues] = useState(DefaultLocalization)
  const personalSettings = usePersonalSettings()

  useEffect(() => {
    const observable = localizationService.currentValues.subscribe((v) => {
      /**
       * This is a temporary solution until we refactor l18n
       * We don't want to set the state if the values are the same.
       */
      if (JSON.stringify(currentValues) === JSON.stringify(v)) {
        return
      }
      setCurrentValues(v)
    })
    return () => observable.dispose()
  }, [currentValues, localizationService.currentValues])

  useEffect(() => {
    const langCode = personalSettings.language === 'hungarian' ? 'hu' : 'en'
    localizationService.load(personalSettings.language)
    moment.locale(langCode)
    document.documentElement.lang = langCode
  }, [localizationService, personalSettings.language])

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
