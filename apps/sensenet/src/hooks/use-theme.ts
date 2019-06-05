import { useContext } from 'react'
import { ThemeContext } from '../context'

export const useTheme = () => useContext(ThemeContext)
