import { useContext } from 'react'
import { LocalizationContext } from '../context'

export const useLocalization = () => {
  return useContext(LocalizationContext).values
}
