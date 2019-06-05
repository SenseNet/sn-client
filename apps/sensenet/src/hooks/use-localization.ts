import { useContext } from 'react'
import { LocalizationContext } from '../context'

export const useLocalization = () => useContext(LocalizationContext).values
