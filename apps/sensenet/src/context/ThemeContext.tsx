import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme'
import React from 'react'
import theme from '../theme'

export const ThemeContext = React.createContext<Theme>(createMuiTheme(theme))
