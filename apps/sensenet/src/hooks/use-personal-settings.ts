import { useContext } from 'react'
import { PersonalSettingsContext } from '../context'

export const usePersonalSettings = () => useContext(PersonalSettingsContext)
