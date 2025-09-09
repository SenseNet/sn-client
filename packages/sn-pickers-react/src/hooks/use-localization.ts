import { useContext } from 'react'
import { LocalizationContext } from '../context/localizatzion-context'

export const useLocalization = () => {
  return useContext(LocalizationContext)
}
