import { deepMerge, DeepPartial } from '@sensenet/client-utils'
import React, { createContext, FC, useEffect, useState } from 'react'

export const defaultLocalization = {
  currentContextError: 'There was an unexpected error while fetching content!',
}

export const LocalizationContext = createContext(defaultLocalization)

export type LocalizationType = DeepPartial<typeof defaultLocalization>

interface LocalizationProviderProps {
  localization?: Partial<LocalizationType>
}

export const LocalizationProvider: FC<LocalizationProviderProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(deepMerge(defaultLocalization, props.localization))

  useEffect(() => {
    setCurrentValue(deepMerge(defaultLocalization, props.localization))
  }, [props.localization])

  return <LocalizationContext.Provider value={currentValue}>{props.children}</LocalizationContext.Provider>
}
