import { MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import zIndex from '@material-ui/core/styles/zIndex'
import { useInjector } from '@sensenet/hooks-react'
import React, { useEffect, useMemo, useState } from 'react'
import LarsseitBold from '../assets/fonts/LarsseitBold.woff'
import { usePersonalSettings } from '../hooks'
import { PersonalSettings } from '../services'
import { ThemeContext } from './ThemeContext'

export interface IMaterialUIFontFace {
  fontFamily: string
  fontStyle?: string
  fontDisplay: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  fontWeight: number
  src: string
  unicodeRange?: string
}

export const ThemeProvider: React.FunctionComponent = (props) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const personalSettings = usePersonalSettings()
  const di = useInjector()
  const settingsService = di.getInstance(PersonalSettings)
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>(prefersDark ? 'dark' : 'light')

  useEffect(() => {
    const userValue = settingsService.userValue.getValue()
    if (!userValue.theme) {
      settingsService.setPersonalSettingsValue({ ...userValue, theme: prefersDark ? 'dark' : 'light' })
      setPageTheme(prefersDark ? 'dark' : 'light')
    } else {
      // We don't want to do an update if the two values are the same
      if ((userValue.theme === 'dark' && prefersDark) || (userValue.theme === 'light' && !prefersDark)) {
        return
      }
      settingsService.setPersonalSettingsValue({ ...userValue, theme: userValue.theme })
      setPageTheme(userValue.theme)
    }
  }, [prefersDark, settingsService])

  const theme = useMemo(() => {
    const larsseit: IMaterialUIFontFace = {
      fontFamily: 'Larsseit',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      fontWeight: 400,
      src: `
        local('Larsseit'),
        local('Larsseit-Regular'),
        url(${LarsseitBold}) format('woff')
      `,
      unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
    }

    const nextTheme = createMuiTheme({
      typography: {
        fontFamily: ['Roboto', 'Helvetica', 'sans-serif', 'Arial', 'Larsseit'].join(','),
        h1: {
          fontFamily: '"Larsseit", Roboto',
        },
        h2: {
          fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
        },
      },
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
          light: '#80cbc4',
          main: '#26a69a',
          dark: '#00796b',
        },
        secondary: {
          light: '#90caf9',
          main: '#1976d2',
          dark: '#1565c0',
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
            border: 'none !important',
          },
        },
        MuiListItemIcon: {
          root: {
            color: pageTheme === 'light' ? '#000000' : '#FFFFFF',
          },
        },
        MuiPickersDatePickerRoot: {
          toolbar: {
            backgroundColor: pageTheme === 'light' ? '#B2B2B2' : 'rgba(255,255,255,0.05)',
          },
        },
        MuiPickersBasePicker: {
          pickerView: {
            backgroundColor: pageTheme === 'light' ? '#E2E2E2' : 'rgba(255,255,255,0.11)',
          },
        },
        MuiPickersCalendarHeader: {
          iconButton: {
            backgroundColor: 'transparent',
          },
        },
        MuiPickersModal: {
          dialogRoot: {
            '& .MuiDialogActions-root': {
              backgroundColor: pageTheme === 'light' ? '#E2E2E2' : 'rgba(255,255,255,0.11)',
            },
          },
        },
        MuiCssBaseline: {
          '@global': {
            '@font-face': [larsseit],
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
