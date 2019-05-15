import { ODataWopiResponse, Repository } from '@sensenet/client-core'

export const getWopiData = (idOrPath: string | number) => ({
  type: 'GET_WOPIDATA',
  idOrPath,
  payload: (repository: Repository) =>
    repository.executeAction<undefined, ODataWopiResponse>({
      idOrPath,
      name: 'GetWopiData',
      method: 'GET',
      oDataOptions: {
        action: 'edit',
      } as any,
      body: undefined,
    }),
})
