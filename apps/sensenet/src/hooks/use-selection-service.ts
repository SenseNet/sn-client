import { useInjector } from '@sensenet/hooks-react'
import { useState } from 'react'
import { SelectionService } from '../services/SelectionService'

export const useSelectionService = () => {
  const injector = useInjector()
  const [selectionService] = useState(injector.getInstance(SelectionService))
  return selectionService
}
