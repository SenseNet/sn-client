import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useMemo, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useInjector } from '@sensenet/hooks-react'
import zIndex from '@material-ui/core/styles/zIndex'
import { usePersonalSettings } from '../hooks'
import { PersonalSettings } from '../services'
import { ThemeContext } from './ThemeContext'

export const ThemeProvider: React.FunctionComponent = props => {
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
      palette: {
        type: pageTheme,
        background: {
          default: pageTheme === 'light' ? '#FFFFFF' : '#121212',
          paper: pageTheme === 'light' ? '#FFFFFF' : '#121212',
        },
        text: {
          primary: pageTheme === 'light' ? '#000000' : '#FFFFFF',
          secondary: pageTheme === 'light' ? '#000000' : '#FFFFFF',
        },
        primary: {
          main: '#26A69A',
        },
        secondary: {
          main: '#1976d2',
        },
      },
      overrides: {
        MuiAppBar: {
          root: {
            zIndex: zIndex.drawer + 1,
          },
        },
        MuiTableCell: {
          root: {
            padding: '4px 56px 4px 24px',
            border: 'none',
          },
        },
        MuiInputBase: {
          input: {
            border: '1px solid #505050',
            borderRadius: '4px',
          },
        },
        MuiListItemIcon: {
          root: {
            color: pageTheme === 'light' ? '#000000' : '#FFFFFF',
          },
        },
      },
    })

    return nextTheme
  }, [pageTheme])

  useEffect(() => {
    setPageTheme(personalSettings.theme)
  }, [personalSettings.theme])

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}
