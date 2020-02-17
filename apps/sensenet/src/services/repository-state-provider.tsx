import { ConstantContent, Repository } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { useLocalStorage } from '@sensenet/hooks-react'
import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { LoginPage } from '../components/login/login-page'
import theme from '../components/theme'
import { ThemeProvider } from '../context'
import { getAuthService } from './auth-service'

export type RepositoryWithState = {
  id: string
  repository: Repository
  currentUser: User
  isOnline: boolean
  isActive: boolean
}

type Action =
  | { type: 'PUSH_REPOSITORYSTATE'; state: Omit<RepositoryWithState, 'id'> }
  | { type: 'REMOVE_REPOSITORYSTATE'; id: string }
  | { type: 'MODIFY_REPOSITORYSTATE'; state: RepositoryWithState }

const initialState: RepositoryWithState[] = []
const RepoStateContext = createContext<
  { repoStates: typeof initialState; dispatch: React.Dispatch<Action> } | undefined
>(undefined)

function repoStateReducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case 'PUSH_REPOSITORYSTATE': {
      const id = `${action.state.repository.configuration.repositoryUrl}-${action.state.currentUser.Name}`
      window.localStorage.setItem('repo-key', JSON.stringify(action.state.repository.configuration.repositoryUrl))
      if (state.some(repo => repo.id === id)) {
        return state
      }
      return [...state, { ...action.state, id }]
    }
    case 'REMOVE_REPOSITORYSTATE': {
      const repoStates = state.filter(repo => repo.id !== action.id)
      return repoStates
    }
    case 'MODIFY_REPOSITORYSTATE':
      return initialState
    default: {
      return state
    }
  }
}

export function RepoStateProvider({ children }: { children: React.ReactNode }) {
  const [repoStates, dispatch] = useReducer(repoStateReducer, initialState)
  const { storedValue: currentRepoUrl } = useLocalStorage<string | undefined>('repo-key')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getCurrentUser(repository: Repository, idOrPath: string) {
      try {
        const result = await repository.load<User>({
          idOrPath,
          oDataOptions: {
            select: 'all',
          },
        })
        if (result.d.Id !== ConstantContent.VISITOR_USER.Id) {
          return result.d
        }
        return ConstantContent.VISITOR_USER as User
      } catch (error) {
        console.log(`Couldn't load current user: ${error.message}`)
        return ConstantContent.VISITOR_USER as User
      }
    }
    async function getRepo() {
      if (!currentRepoUrl) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const authService = await getAuthService(currentRepoUrl)
      const user = await authService.getUser()
      const token = await authService.getAccessToken()
      if (!user || !token) {
        setIsLoading(false)
        return
      }
      const repository = new Repository({ repositoryUrl: currentRepoUrl, token })
      const currentUser = await getCurrentUser(repository, user.sub)

      dispatch({
        type: 'PUSH_REPOSITORYSTATE',
        state: {
          isActive: true,
          isOnline: true,
          repository,
          currentUser,
        },
      })
      setIsLoading(false)
    }
    getRepo()
  }, [currentRepoUrl])

  if (isLoading) {
    return null
  }

  return (
    <RepoStateContext.Provider value={{ repoStates, dispatch }}>
      {repoStates.find(repoState => repoState.isActive) ? (
        children
      ) : (
        <ThemeProvider theme={theme}>
          <LoginPage />
        </ThemeProvider>
      )}
    </RepoStateContext.Provider>
  )
}

/**
 * Custom hook that returns functions for repository state management
 */
export function useRepoState() {
  const context = useContext(RepoStateContext)

  if (!context) {
    throw new Error('useRepoState must be used within a RepoStateProvider')
  }
  const { dispatch, repoStates } = context

  const addRepository = useCallback(
    (state: Omit<RepositoryWithState, 'id'>) => dispatch({ type: 'PUSH_REPOSITORYSTATE', state }),
    [dispatch],
  )
  const getCurrentRepository = () => repoStates.find(repoState => repoState.isActive)?.repository
  const getCurrentRepoState = () => repoStates.find(repoState => repoState.isActive)

  return {
    repoStates,
    addRepository,
    getCurrentRepository,
    getCurrentRepoState,
  }
}
