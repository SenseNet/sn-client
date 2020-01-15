import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useMemo, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useInjector } from '@sensenet/hooks-react'
import { usePersonalSettings } from '../hooks'
import { PersonalSettings } from '../services'
import { ThemeContext } from './ThemeContext'

export const ThemeProvider: React.FunctionComponent<{ theme: ThemeOptions }> = props => {
  const preferredType = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  const personalSettings = usePersonalSettings()
  const di = useInjector()
  const settingsService = di.getInstance(PersonalSettings)
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>(preferredType)

  useEffect(() => {
    setPageTheme(preferredType)
    const userValue = settingsService.userValue.getValue()
    settingsService.setPersonalSettingsValue({ ...userValue, theme: preferredType })
  }, [preferredType, settingsService])

  const theme = useMemo(() => {
    const nextTheme = createMuiTheme({
      ...props.theme,
      palette: {
        ...props.theme.palette,
        type: pageTheme,
      },
    })

    return nextTheme
  }, [pageTheme, props.theme])

  useEffect(() => {
    setPageTheme(personalSettings.theme)
  }, [personalSettings.theme])

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}
