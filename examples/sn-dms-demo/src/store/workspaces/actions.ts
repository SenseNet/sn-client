import { Repository } from '@sensenet/client-core'
import { Workspace } from '@sensenet/default-content-types'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from '../../store/rootReducer'

export const loadWorkspaces = () => ({
  type: 'LOAD_WORKSPACES',
})

export const setWorkspaces = (workspaces: Workspace[]) => ({
  type: 'SET_WORKSPACES',
  workspaces,
})

export const getWorkspaces = () => ({
  type: 'GET_WORKSPACES',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    if (!options.getState().dms.workspaces.isLoading) {
      options.dispatch(loadWorkspaces())
      const repository = options.getInjectable(Repository)
      const workspaces = await repository.loadCollection<Workspace>({
        path: '/',
        oDataOptions: {
          query: 'TypeIs:Workspace -TypeIs:Site',
          select: ['DisplayName', 'Id', 'Path'],
          orderby: [['DisplayName', 'asc']],
        },
      })
      options.dispatch(setWorkspaces(workspaces.d.results))
    }
  },
})

export const searchWorkspaces = (text: string) => ({
  type: 'SEARCH_WORKSPACES',
  text,
})
