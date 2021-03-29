import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { createContext } from 'react'

export const ThemeContext = createContext<Theme | undefined>(undefined)
