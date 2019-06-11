import { useContext } from 'react'
import { InjectorContext } from '../context'
import { SelectionService } from '../services/SelectionService'

export const useSelectionService = () => useContext(InjectorContext).getInstance(SelectionService)
