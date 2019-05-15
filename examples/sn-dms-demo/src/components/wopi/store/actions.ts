import { Repository } from '@sensenet/client-core'
import { WopiDataEntry } from '../models/WopiData'

export const getWopiData = (idOrPath: string | number) => ({
  type: 'GET_WOPIDATA',
  idOrPath,
  payload: (repository: Repository) =>
    repository.executeAction<undefined, WopiDataEntry>({
      idOrPath,
      name: 'GetWopiData',
      method: 'GET',
      oDataOptions: {
        action: 'edit',
      } as any,
      body: undefined,
    }),
})
