import { Theme } from '@material-ui/core/styles'
import { createContext } from 'react'

export const ThemeContext = createContext<Theme | undefined>(undefined)
