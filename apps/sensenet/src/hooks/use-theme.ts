import { useContext } from 'react'
import { ThemeContext } from '../context'

export const useTheme = () => {
  if (!ThemeContext) {
    throw new Error('ThemeContext is not provided')
  }
  return useContext(ThemeContext)
}
