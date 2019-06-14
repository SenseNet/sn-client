import { useContext, useState } from 'react'
import { InjectorContext } from '../context'
import { SelectionService } from '../services/SelectionService'

export const useSelectionService = () => {
  const [selectionService] = useState(useContext(InjectorContext).getInstance(SelectionService))
  return selectionService
}
