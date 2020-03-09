import { deepMerge, DeepPartial } from '@sensenet/client-utils'
import React from 'react'
import MediaQuery from 'react-responsive'
import { usePersonalSettings, useTheme } from '../hooks'
import { defaultSettings } from '../services/PersonalSettings'

export type ResponsivePlatforms = 'desktop' | 'tablet' | 'mobile'

export type PlatformDependent<T> = { [key in ResponsivePlatforms]?: DeepPartial<T> } & {
  default: T
}
export const ResponsiveContext = React.createContext<ResponsivePlatforms>('desktop')
export const ResponsivePersonalSetttings = React.createContext(defaultSettings.default)

export const ResponsiveContextProvider: React.FunctionComponent = props => {
  const theme = useTheme()
  const personalSettings = usePersonalSettings()
  return (
    <>
      <MediaQuery query={theme.breakpoints.up('lg').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={deepMerge(personalSettings.default, personalSettings.desktop)}>
          <ResponsiveContext.Provider value="desktop">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.only('md').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={deepMerge(personalSettings.default, personalSettings.tablet)}>
          <ResponsiveContext.Provider value="tablet">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.down('sm').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={deepMerge(personalSettings.default, personalSettings.mobile)}>
          <ResponsiveContext.Provider value="mobile">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
    </>
  )
}
