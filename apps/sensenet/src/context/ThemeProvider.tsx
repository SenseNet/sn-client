import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React, { useContext } from 'react'
import { ResponsivePersonalSetttings } from './ResponsiveContextProvider'
import { ThemeContext } from './ThemeContext'

const mergeThemes = (options: ThemeOptions, type: 'light' | 'dark') =>
  createMuiTheme({
    ...options,
    palette: {
      ...options.palette,
      type,
    },
  })

export const ThemeProvider: React.FunctionComponent<{ theme: ThemeOptions }> = props => {
  const ps = useContext(ResponsivePersonalSetttings)
  const theme = mergeThemes(props.theme, ps.theme)
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}
