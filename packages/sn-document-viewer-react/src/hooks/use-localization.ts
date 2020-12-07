import { useContext } from 'react'
import { LocalizationContext } from '../context/localization-context'

export const useLocalization = () => useContext(LocalizationContext)
