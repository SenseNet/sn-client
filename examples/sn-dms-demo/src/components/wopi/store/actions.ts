import { Repository } from '@sensenet/client-core'

export const getWopiData = (idOrPath: string | number) => ({
  type: 'GET_WOPIDATA',
  idOrPath,
  payload: (repository: Repository) => repository.getWopiData(idOrPath),
})
