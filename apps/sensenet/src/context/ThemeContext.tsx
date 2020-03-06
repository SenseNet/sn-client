import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme'
import React from 'react'

export const ThemeContext = React.createContext<Theme | undefined>(undefined)
