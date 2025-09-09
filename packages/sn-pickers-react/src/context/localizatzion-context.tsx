import { deepMerge, DeepPartial } from '@sensenet/client-utils'
import React, { createContext, useEffect, useState } from 'react'

export const defaultLocalization = {
  submit: 'Submit',
  cancel: 'Cancel',
  disabledPath: 'Disabled Path',
  search: 'Search',
}

export const LocalizationContext = createContext(defaultLocalization)

export type LocalizationType = DeepPartial<typeof defaultLocalization>

interface LocalizationProviderProps {
  localization?: Partial<LocalizationType>
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(deepMerge(defaultLocalization, props.localization))

  useEffect(() => {
    setCurrentValue(deepMerge(defaultLocalization, props.localization))
  }, [props.localization])

  return <LocalizationContext.Provider value={currentValue}>{props.children}</LocalizationContext.Provider>
}
