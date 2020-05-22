import React from 'react'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

export const ThemeContext = React.createContext<Theme | undefined>(undefined)
