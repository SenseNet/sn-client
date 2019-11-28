import { useContext, useState } from 'react'
import { InjectorContext } from '../context/injector-context-provider'
import { SelectionService } from '../service/selection-service'

export const useSelectionService = () => {
  const [selectionService] = useState(useContext(InjectorContext).getInstance(SelectionService))
  return selectionService
}
