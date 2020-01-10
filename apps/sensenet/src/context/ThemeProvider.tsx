import createMuiTheme, { Theme, ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { usePersonalSettings } from '../hooks'
import { ThemeContext } from './ThemeContext'

const mergeThemes = (options: ThemeOptions, type: 'light' | 'dark' | undefined) =>
  createMuiTheme({
    ...options,
    palette: {
      ...options.palette,
      type: type === 'light' ? 'light' : 'dark',
    },
  })

export const ThemeProvider: React.FunctionComponent<{ theme: ThemeOptions }> = props => {
  const personalSettings = usePersonalSettings()
  const [pageTheme, setPageTheme] = useState<Theme>(mergeThemes(props.theme, personalSettings.theme))

  useEffect(() => {
    setPageTheme(mergeThemes(props.theme, personalSettings.theme))
  }, [personalSettings.theme, props.theme])

  return (
    <MuiThemeProvider theme={pageTheme}>
      <ThemeContext.Provider value={pageTheme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}
