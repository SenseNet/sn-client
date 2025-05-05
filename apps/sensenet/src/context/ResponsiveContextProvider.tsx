import { deepMerge, DeepPartial } from '@sensenet/client-utils'
import React, { createContext, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { usePersonalSettings, useTheme } from '../hooks'
import { defaultSettings } from '../services/PersonalSettings'

export type ResponsivePlatforms = 'desktop' | 'tablet' | 'mobile'
export type PlatformDependent<T> = { [key in ResponsivePlatforms]?: DeepPartial<T> } & { default: T }

export const ResponsiveContext = createContext<ResponsivePlatforms>('desktop')
export const ResponsivePersonalSettings = createContext(defaultSettings.default)

export const ResponsiveContextProvider: React.FC = ({ children }) => {
  const theme = useTheme()
  const personalSettings = usePersonalSettings()

  const isDesktop = useMediaQuery({ query: theme.breakpoints.up('lg').replace('@media ', '') })
  const isTablet = useMediaQuery({ query: theme.breakpoints.only('md').replace('@media ', '') })

  const platform: ResponsivePlatforms = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile'

  const mergedSettings = useMemo(
    () => deepMerge(personalSettings.default, personalSettings[platform]),
    [personalSettings, platform],
  )

  return (
    <ResponsiveContext.Provider value={platform}>
      <ResponsivePersonalSettings.Provider value={mergedSettings}>{children}</ResponsivePersonalSettings.Provider>
    </ResponsiveContext.Provider>
  )
}
