import { useState } from 'react'
import { useInjector } from '@sensenet/hooks-react'
import { ThemeService } from '../services/ThemeService'

export const useThemeService = () => {
  const injector = useInjector()
  const [themeService] = useState(injector.getInstance(ThemeService))
  return themeService
}
