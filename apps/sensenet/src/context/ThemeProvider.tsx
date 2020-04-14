import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useMemo, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useInjector } from '@sensenet/hooks-react'
import zIndex from '@material-ui/core/styles/zIndex'
import { usePersonalSettings } from '../hooks'
import { PersonalSettings } from '../services'
import { ThemeContext } from './ThemeContext'

export const ThemeProvider: React.FunctionComponent = (props) => {
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
