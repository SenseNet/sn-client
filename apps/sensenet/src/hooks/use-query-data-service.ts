import { useState } from 'react'
import { useInjector } from '@sensenet/hooks-react'
import { QueryDataService } from '../services/QueryDataService'

export const useQueryDataService = () => {
  const injector = useInjector()
  const [queryDataService] = useState(injector.getInstance(QueryDataService))
  return queryDataService
}
